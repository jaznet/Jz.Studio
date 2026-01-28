/* jz-button-block-render.service.ts
   Consolidated version with:
   - Single shared WebGLRenderer, copied into per-button 2D canvases
   - PMREM RoomEnvironment setup (TS-safe wrapper via envScene)
   - Optional environment toggle + intensity (kept OFF by default)
   - PROVEN LIGHTING: Key + Rim (no fill yet) using DirectionalLights
   - Debug diagonal line (LRB -> ULF) drawn on top (toggle)  -> REMOVED
   - FIX: renderer sizing uses CSS pixels + pixelRatio (no double-DPR)
   - Material archetypes + caching with versioned key
*/

import { Injectable, NgZone } from "@angular/core";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { makeButtonBlockGeometry } from "./jz-button-block-geometry";
import { buildMaterialPreset, JzButtonMaterialArchetype } from "./jz-button-block-materials";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
//import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";


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

  // ---- Lights (Key + Rim) ----
  private keyLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;

  // Optional debug helper for the key
  private keyHelper?: THREE.DirectionalLightHelper;

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
  private readonly DEBUG_SHOW_KEY_HELPER = false;

  // Environment toggle (OFF while tuning spec)
  private readonly USE_ENVIRONMENT = false;
  private readonly ENV_INTENSITY = 0.25;

  // Geometry dims (must match makeButtonBlockGeometry inputs)
  private readonly W = 1.8;
  private readonly H = 0.78;
  private readonly D = 0.20;

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
      antialias: false,              // <-- key
      alpha: true,
      premultipliedAlpha: false,     // <-- also important
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });

    this.renderer.setClearColor(0xff00ff, 1); // magenta, opaque

    this.renderer.setPixelRatio(Math.min((devicePixelRatio ?? 1) * 2, 3)); // supersample
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;

    // Slightly higher exposure helps dark colors when env is OFF
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();

    // ---- Environment OFF (for clean spec tuning) ----
    this.scene.environment = null;
    (this.scene as any).environmentIntensity = 0;

    // PMREM retained so you can flip USE_ENVIRONMENT later without revisiting plumbing
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.add(new RoomEnvironment());
    this.envTex = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();

    // ---- Camera: straight-on ----
    // ---- Camera: straight-on (telephoto) ----
    this.camera = new THREE.PerspectiveCamera(14, 1, 0.01, 20);
    this.camera.position.set(0, 0, 3.4);
    this.camera.lookAt(0, 0, 0);

    // ---- Geometry ----
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

    // Improve bevel/edge shading
    this.geom = BufferGeometryUtils.mergeVertices(this.geom, 5e-4) as THREE.BufferGeometry;
    this.geom.computeVertexNormals();
    //this.geom = BufferGeometryUtils.mergeVertices(this.geom, 1e-4);
    //this.geom.computeVertexNormals();

    // Default material (overridden per-frame)
    this.mesh = new THREE.Mesh(this.geom, this.getMaterial("bakeliteSatin", "#2f3440"));
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);

    // Slightly toward camera so the side-wall doesn't read as a dark outline
    this.mesh.position.z = -0.0;

    this.scene.add(this.mesh);

    // ---- Lights: Key + Rim (no fill) ----
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    this.keyLight.position.set(-0.9, 0.9, 3.2); // move key forward with telephoto camera
    this.keyLight.target.position.set(0, 0, 0);
    this.scene.add(this.keyLight, this.keyLight.target);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    this.rimLight.position.set(1.1, -0.4, 2.0);
    this.rimLight.target.position.set(0, 0, 0);
    this.scene.add(this.rimLight, this.rimLight.target);

    const frontFill = new THREE.DirectionalLight(0xffffff, 0.10);
    frontFill.position.set(0.0, 0.0, 4.0); // from camera
    frontFill.target.position.set(0, 0, 0);
    this.scene.add(frontFill, frontFill.target);


    // Optional helper (DirectionalLightHelper)
    if (this.DEBUG_SHOW_KEY_HELPER) {
      this.keyHelper = new THREE.DirectionalLightHelper(this.keyLight, 0.45, 0xffffff);
      this.scene.add(this.keyHelper);
    }

    // NOTE: If you want to remain strictly "no fill", keep this OFF.
    // If you want to slightly lift the very dark outside band, enable this (very low).
    // very small: just prevents “dead black” side band
 //   this.scene.add(new THREE.AmbientLight(0xffffff, 0.03));
    // Subtle "sky/ground" lift to prevent the underside band from going dead black
    const hemi = new THREE.HemisphereLight(0xffffff, 0x3e6b67, 0.14);
    this.scene.add(hemi);

  }

  private applyEnvironment(): void {
    if (this.USE_ENVIRONMENT) {
      this.scene.environment = this.envTex;
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
   * For a DirectionalLight, "direction" is (target - position). When the target is origin,
   * positioning the light along the computed direction gives a stable, predictable key.
   *
   * NOTE: leave unused unless you want auto-aiming for glossy.
   */
  private positionKeyLightForGlossyULF(): void {
    const cornerNormal = new THREE.Vector3(-1, +1, +1).normalize();

    const viewDir = this.camera.position.clone().normalize();
    const lightDir = viewDir.clone().reflect(cornerNormal).negate().normalize();

    const dist = 4.0;
    this.keyLight.position.copy(lightDir.multiplyScalar(dist));
    this.keyLight.target.position.set(0, 0, 0);
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

  private normalizeHex(hex: string): string {
    const h = (hex ?? "").trim();
    if (!h) return "#000000";
    if (h.startsWith("#")) return h;
    return `#${h}`;
  }

  private getMaterial(finish: JzButtonBlockFinish, hex: string): THREE.Material {
    const archetype = this.normalizeFinishToArchetype(finish);
    const normalizedHex = this.normalizeHex(hex);
    const key = `${this.MATERIAL_PRESET_VERSION}|${archetype}|${normalizedHex}`;

    const cached = this.matCache.get(key);
    if (cached) return cached;

    const { mat } = buildMaterialPreset(archetype, normalizedHex);

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
    const nextMat = this.getMaterial(finish, baseHex);
    if (this.mesh.material !== nextMat) {
      this.mesh.material = nextMat;
      (nextMat as THREE.Material).needsUpdate = true;
    }

    // If you ever want auto-aiming for glossy, re-enable this:
    // if (finish === "glossy" || (typeof finish === "string" && finish.startsWith("bakelite"))) {
    //   this.positionKeyLightForGlossyULF();
    // }

    // Exposure: keep conservative; tune later
  //  this.renderer.toneMappingExposure = this.USE_ENVIRONMENT ? 1.0 : 1.25;

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

    const size = new THREE.Vector2();
    this.renderer.getSize(size); // CSS px
    const db = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(db); // real px

    if (canvas2d.width !== db.x || canvas2d.height !== db.y) {
      canvas2d.width = db.x;
      canvas2d.height = db.y;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, db.x, db.y);
    ctx.drawImage(this.renderer.domElement, 0, 0); // <-- no dest sizing
  }
}
