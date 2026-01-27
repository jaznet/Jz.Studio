/* jz-button-block-render.service.ts
   Consolidated version with:
   - Single shared WebGLRenderer, copied into per-button 2D canvases
   - PMREM RoomEnvironment setup (TS-safe wrapper via envScene)
   - Optional environment toggle + intensity (kept OFF by default)
   - Key light placement tuned for glossy specular at ULF (approx)
   - Debug diagonal line (LRB -> ULF) drawn on top (toggle)
   - FIX: renderer sizing uses CSS pixels + pixelRatio (no double-DPR)
   - Material archetypes + caching with versioned key
*/

import { Injectable, NgZone } from "@angular/core";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { makeButtonBlockGeometry } from "./jz-button-block-geometry";
import { buildMaterialPreset, JzButtonMaterialArchetype } from "./jz-button-block-materials";

export type JzButtonBlockFinish =
  | "matte"
  | "anodized"
  | "glossy"
  | JzButtonMaterialArchetype;

export type JzButtonBlockReg = {
  canvas2d: HTMLCanvasElement;

  getFinish: () => JzButtonBlockFinish;
  getBaseHex: () => string;

  /** True if this button should be "live" rendered (hover/focus/pressed). */
  isActive: () => boolean;

  /** 0 idle, ~0.6 hover/focus, 1 pressed. */
  getT: () => number;

  /** cached 2D ctx */
  ctx2d?: CanvasRenderingContext2D;
};

@Injectable({ providedIn: "root" })
export class JzButtonBlockRenderService {
  // ---- Core Three ----
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private mesh!: THREE.Mesh;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.HemisphereLight;
  private rimLight!: THREE.DirectionalLight;

  private envTex!: THREE.Texture;

  // ---- Registry / loop ----
  private regs = new Map<HTMLCanvasElement, JzButtonBlockReg>();
  private activeCanvas?: HTMLCanvasElement;
  private rafId = 0;

  // ---- Geometry / materials ----
  private geom?: THREE.BufferGeometry;
  private matCache = new Map<string, THREE.Material>();

  // bump this whenever you change presets/caching behavior
  private readonly MATERIAL_PRESET_VERSION = 1;

  // ---- Debug/controls ----
  private readonly DEBUG_SHOW_DIAGONAL = true;
  private readonly DEBUG_SHOW_KEY_HELPER = false;

  // Environment toggle (OFF while debugging spec)
  private readonly USE_ENVIRONMENT = false;
  private readonly ENV_INTENSITY = 0.25;

  // Geometry dims (must match makeButtonBlockGeometry inputs)
  private readonly W = 1.8;
  private readonly H = 0.78;
  private readonly D = 0.30;

  private diagLine?: THREE.Line;
  private keyHelper?: THREE.DirectionalLightHelper;

  constructor(private zone: NgZone) { }

  // -------------------------
  // Public API
  // -------------------------

  register(reg: JzButtonBlockReg): () => void {
    this.ensureInit();
    this.regs.set(reg.canvas2d, reg);

    return () => {
      this.regs.delete(reg.canvas2d);
      if (this.activeCanvas === reg.canvas2d) {
        this.activeCanvas = undefined;
        this.stopLoopIfIdle();
      }
    };
  }

  /** Render a single idle frame into this canvas (used on init and when deactivating). */
  snapshot(canvas: HTMLCanvasElement): void {
    const reg = this.regs.get(canvas);
    if (!reg) return;
    this.renderToCanvas(reg, 0);
  }

  /** Make this canvas the live-render target. */
  setActiveCanvas(canvas: HTMLCanvasElement): void {
    if (!this.regs.has(canvas)) return;

    if (this.activeCanvas && this.activeCanvas !== canvas) {
      // Freeze the old one
      this.snapshot(this.activeCanvas);
    }

    this.activeCanvas = canvas;
    this.startLoop();
  }

  /** If this canvas is active but no longer needs live rendering, snapshot and release. */
  maybeReleaseActive(canvas: HTMLCanvasElement): void {
    if (this.activeCanvas !== canvas) return;

    const reg = this.regs.get(canvas);
    if (reg && !reg.isActive()) {
      this.renderToCanvas(reg, 0);
      this.activeCanvas = undefined;
      this.stopLoopIfIdle();
    }
  }

  // -------------------------
  // Init
  // -------------------------

  private ensureInit(): void {
    if (this.renderer) return;

    const dpr = Math.min((globalThis.window?.devicePixelRatio ?? 1), 2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // required for drawImage(renderer.domElement)
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();

    // Environment (PMREM from RoomEnvironment) - TS-safe wrapper
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.add(new RoomEnvironment());
    this.envTex = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();

    this.applyEnvironment();

    // Camera: face-on
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.01, 10);
    this.camera.position.set(0.0, 0.0, 2.2);
    this.camera.lookAt(0, 0, 0);

    // Geometry
    this.geom = makeButtonBlockGeometry({
      width: this.W,
      height: this.H,
      radius: 0.22,
      depth: this.D,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 24,
      bevelSegments: 10,
    });

    // Default material (overridden per-frame)
    this.mesh = new THREE.Mesh(this.geom, this.getMaterial("bakeliteSatin", "#2f3440"));
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
    this.scene.add(this.mesh);

    // ---- Lights ----

    // Key
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.05);
    this.keyLight.target.position.set(0, 0, 0);
    this.scene.add(this.keyLight.target);
    this.scene.add(this.keyLight);

    // Position key for glossy highlight near ULF corner (approx)
    this.positionKeyLightForGlossyULF();

    if (this.DEBUG_SHOW_KEY_HELPER) {
      this.keyHelper = new THREE.DirectionalLightHelper(this.keyLight, 0.35, 0xffffff);
      this.scene.add(this.keyHelper);
    }

    // Fill + Rim (created but OFF by default for debugging)
    this.fillLight = new THREE.HemisphereLight(0xffffff, 0x1a1f2a, 0.75);
    this.fillLight.visible = false;
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.15);
    this.rimLight.position.set(1.2, 0.8, -1.4);
    this.rimLight.visible = false;
    this.scene.add(this.rimLight);

    // Debug diagonal line (LRB -> ULF) drawn on top
    if (this.DEBUG_SHOW_DIAGONAL) {
      this.upsertDiagonalLine_LRB_to_ULF(this.W, this.H, this.D);
    }
  }

  private applyEnvironment(): void {
    if (this.USE_ENVIRONMENT) {
      this.scene.environment = this.envTex;
      // r182: environmentIntensity exists on Scene, but TS typings vary; cast keeps it safe
      (this.scene as any).environmentIntensity = this.ENV_INTENSITY;
    } else {
      this.scene.environment = null;
      (this.scene as any).environmentIntensity = 0;
    }
  }

  // -------------------------
  // Key light placement (glossy)
  // -------------------------

  /**
   * For mirror-like specular, highlight center occurs where the surface normal reflects
   * light into the camera. We approximate the ULF bevel normal as (-1, +1, +1).
   *
   * reflect(-L, N) == V  => L = -reflect(V, N)
   *
   * DirectionalLight direction is (target - position), so "light direction from surface->light"
   * corresponds to the light's position vector when target is at origin.
   */
  private positionKeyLightForGlossyULF(): void {
    const cornerNormal = new THREE.Vector3(-1, +1, +1).normalize();

    // View direction from origin to camera
    const viewDir = this.camera.position.clone().normalize();

    // Desired direction from surface -> light
    const lightDir = viewDir.clone().reflect(cornerNormal).negate().normalize();

    const dist = 4.0; // farther behaves more "directional"
    this.keyLight.position.copy(lightDir.multiplyScalar(dist));
    this.keyLight.target.position.set(0, 0, 0);
  }

  // -------------------------
  // Debug diagonal
  // -------------------------

  private upsertDiagonalLine_LRB_to_ULF(w: number, h: number, d: number): void {
    const a = new THREE.Vector3(+w / 2, -h / 2, -d / 2); // LRB
    const b = new THREE.Vector3(-w / 2, +h / 2, +d / 2); // ULF

    const dir = b.clone().sub(a).normalize();
    const pad = Math.max(w, h, d) * 1.2;

    const a2 = a.clone().addScaledVector(dir, -pad);
    const b2 = b.clone().addScaledVector(dir, +pad);

    const geom = new THREE.BufferGeometry().setFromPoints([a2, b2]);

    if (!this.diagLine) {
      const mat = new THREE.LineBasicMaterial({
        color: 0x4f5d75,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
        depthWrite: false,
      });

      this.diagLine = new THREE.Line(geom, mat);
      this.diagLine.renderOrder = 999;
      this.scene.add(this.diagLine);
    } else {
      this.diagLine.geometry.dispose();
      this.diagLine.geometry = geom;
    }
  }

  // -------------------------
  // Materials
  // -------------------------

  private isArchetype(x: string): x is JzButtonMaterialArchetype {
    return (
      x === "bakeliteSatin" ||
      x === "bakeliteGloss" ||
      x === "ceramicSatin" ||
      x === "softPlastic" ||
      x === "anodizedMetal" ||
      x === "polishedMetal" ||
      x === "lacquered"
    );
  }

  private normalizeFinishToArchetype(finish: JzButtonBlockFinish): JzButtonMaterialArchetype {
    if (this.isArchetype(finish)) return finish;

    // Legacy UI names -> archetypes
    switch (finish) {
      case "matte":
        return "softPlastic";
      case "anodized":
        return "anodizedMetal";
      case "glossy":
        return "bakeliteSatin";
      default:
        return "bakeliteSatin";
    }
  }

  private getMaterial(finish: JzButtonBlockFinish, hex: string): THREE.Material {
    const archetype = this.normalizeFinishToArchetype(finish);
    const key = `${this.MATERIAL_PRESET_VERSION}|${archetype}|${hex}`;

    const cached = this.matCache.get(key);
    if (cached) return cached;

    const { mat } = buildMaterialPreset(archetype, hex);

    this.matCache.set(key, mat);
    return mat;
  }

  // -------------------------
  // Loop
  // -------------------------

  private startLoop(): void {
    if (this.rafId) return;

    this.zone.runOutsideAngular(() => {
      const tick = () => {
        this.renderActive();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  private stopLoopIfIdle(): void {
    if (this.activeCanvas) return;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private renderActive(): void {
    if (!this.activeCanvas) return;

    const reg = this.regs.get(this.activeCanvas);
    if (!reg) {
      this.activeCanvas = undefined;
      this.stopLoopIfIdle();
      return;
    }

    if (!reg.isActive()) {
      this.renderToCanvas(reg, 0);
      this.activeCanvas = undefined;
      this.stopLoopIfIdle();
      return;
    }

    this.renderToCanvas(reg, reg.getT());
  }

  // -------------------------
  // Render
  // -------------------------

  private renderToCanvas(reg: JzButtonBlockReg, t: number): void {
    const canvas2d = reg.canvas2d;
    const rect = canvas2d.getBoundingClientRect();

    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);

    const rw = Math.max(1, Math.floor(cssW * dpr));
    const rh = Math.max(1, Math.floor(cssH * dpr));

    // IMPORTANT: setSize uses CSS px because setPixelRatio is set
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(cssW, cssH, false);

    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();

    // Environment policy (kept consistent)
    this.applyEnvironment();

    // Material
    const finish = reg.getFinish();
    const baseHex = reg.getBaseHex();
    this.mesh.material = this.getMaterial(finish, baseHex);

    // Key-light alignment for glossy (optional, safe to run per-frame)
    if (finish === "glossy" || (typeof finish === "string" && finish.startsWith("bakelite"))) {
      this.positionKeyLightForGlossyULF();
    }

    // Exposure: keep conservative; tune later
    this.renderer.toneMappingExposure = 1.0;

    // Interaction motion
    const pressed = t >= 0.999;
    this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, pressed ? -0.03 : 0, 0.22);
    this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, -0.08 * t, 0.16);
    this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, 0.10 * t, 0.16);

    this.keyHelper?.update();

    // Render WebGL
    this.renderer.render(this.scene, this.camera);

    // Copy to per-button 2D canvas
    const ctx = (reg.ctx2d ??= canvas2d.getContext("2d", { alpha: true })!);

    if (canvas2d.width !== rw || canvas2d.height !== rh) {
      canvas2d.width = rw;
      canvas2d.height = rh;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, rw, rh);
    ctx.drawImage(this.renderer.domElement, 0, 0, rw, rh);
  }
}
