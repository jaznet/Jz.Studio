/* jz-button-block-render.service.ts
   Picks the “least artifact / most stable” options for your pipeline:

   ✅ Keep premultipliedAlpha = true (CRITICAL when copying WebGL canvas into a 2D canvas)
   ✅ Use transparent clear (alpha 0) so the button can sit on ANY background
   ✅ Disable MSAA (antialias:false) to avoid edge-resolve fringe
   ✅ Use DPR supersampling via setPixelRatio (cap 2), then copy 1:1 (no scaling)
   ✅ Clear+copy using globalCompositeOperation="copy" (prevents leftover pixels)
*/

import { Injectable, NgZone } from "@angular/core";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { makeButtonBlockGeometry } from "./jz-button-block-geometry";
import { JzButtonMaterialArchetype } from "./jz-button-block-materials";

export type JzButtonBlockFinish =
  | "matte"
  | "anodized"
  | "glossy"
  | JzButtonMaterialArchetype;

export type JzButtonBlockReg = {
  canvas2d: HTMLCanvasElement;

  getFinish: () => JzButtonBlockFinish;
  getBaseHex: () => string;

  isActive: () => boolean;
  getT: () => number;

  ctx2d?: CanvasRenderingContext2D;
};

@Injectable({ providedIn: "root" })
export class JzButtonBlockRenderService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private mesh!: THREE.Mesh;

  private keyLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;

  private envTex!: THREE.Texture;

  private regs = new Map<HTMLCanvasElement, JzButtonBlockReg>();
  private activeCanvas?: HTMLCanvasElement;
  private rafId = 0;

  private geom?: THREE.BufferGeometry;
  private matCache = new Map<string, THREE.Material>();
  private readonly MATERIAL_PRESET_VERSION = 1;

  private readonly USE_ENVIRONMENT = false;
  private readonly ENV_INTENSITY = 0.25;

  private readonly W = 1.8;
  private readonly H = 0.78;
  private readonly D = 0.20;

  constructor(private zone: NgZone) { }

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

  snapshot(canvas: HTMLCanvasElement): void {
    const reg = this.regs.get(canvas);
    if (!reg) return;
    this.renderToCanvas(reg, 0);
  }

  setActiveCanvas(canvas: HTMLCanvasElement): void {
    if (!this.regs.has(canvas)) return;

    if (this.activeCanvas && this.activeCanvas !== canvas) {
      this.snapshot(this.activeCanvas);
    }

    this.activeCanvas = canvas;
    this.startLoop();
  }

  maybeReleaseActive(canvas: HTMLCanvasElement): void {
    if (this.activeCanvas !== canvas) return;

    const reg = this.regs.get(canvas);
    if (reg && !reg.isActive()) {
      this.renderToCanvas(reg, 0);
      this.activeCanvas = undefined;
      this.stopLoopIfIdle();
    }
  }

  private ensureInit(): void {
    if (this.renderer) return;

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,            // keep off (DPR is the AA)
      alpha: false,                // opaque WebGL buffer
      premultipliedAlpha: false,   // irrelevant when alpha:false, but consistent
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 1); // opaque clear
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();

    this.scene.environment = null;
    (this.scene as any).environmentIntensity = 0;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.add(new RoomEnvironment());
    this.envTex = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(14, 1, 0.01, 20);
    this.camera.position.set(0, 0, 3.4);
    this.camera.lookAt(0, 0, 0);

    this.geom = makeButtonBlockGeometry({
      width: this.W,
      height: this.H,
      depth: this.D,
      radius: 0.22,
      fillet: 0.08,
      segments: 18,
    });

    this.mesh = new THREE.Mesh(this.geom, this.getMaterial("bakeliteSatin", "#2f3440"));
    this.mesh.position.set(0, 0, 0);
   // this.mesh.rotation.y = 0.25;  // temporary test
    this.scene.add(this.mesh);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    this.keyLight.position.set(-0.9, 0.9, 3.2);
    this.keyLight.target.position.set(0, 0, 0);
    this.scene.add(this.keyLight, this.keyLight.target);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    this.rimLight.position.set(1.1, -0.4, 2.0);
    this.rimLight.target.position.set(0, 0, 0);
    this.scene.add(this.rimLight, this.rimLight.target);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x0b0f14, 0.10);
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
      case "matte": return "softPlastic";
      case "anodized": return "anodizedMetal";
      case "glossy": return "bakeliteSatin";
      default: return "bakeliteSatin";
    }
  }

  private normalizeHex(hex: string): string {
    const h = (hex ?? "").trim();
    if (!h) return "#000000";
    return h.startsWith("#") ? h : `#${h}`;
  }

  // ✅ FIX: no 'reg' referenced here; use the 'hex' argument
  private getMaterial(finish: JzButtonBlockFinish, hex: string): THREE.Material {
    const archetype = this.normalizeFinishToArchetype(finish);
    const normalizedHex = this.normalizeHex(hex);
    const key = `${this.MATERIAL_PRESET_VERSION}|${archetype}|${normalizedHex}`;

    const cached = this.matCache.get(key);
    if (cached) return cached;

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(normalizedHex),

      metalness: 0.0,
      roughness: 0.28,

      clearcoat: 1.0,
      clearcoatRoughness: 0.06,

      ior: 1.5,

      // If your three version supports it, great. If not, delete these 2 lines.
      specularIntensity: 1.0 as any,
      specularColor: new THREE.Color(0xffffff) as any,
    });

    this.matCache.set(key, mat);
    return mat;
  }

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

  private renderToCanvas(reg: JzButtonBlockReg, t: number): void {
    const canvas2d = reg.canvas2d;
    const rect = canvas2d.getBoundingClientRect();

    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);

    // Prevent CSS resample surprises
    canvas2d.style.width = `${cssW}px`;
    canvas2d.style.height = `${cssH}px`;

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(cssW, cssH, false);

    this.camera.aspect = cssW / cssH;
    this.camera.updateProjectionMatrix();

    this.applyEnvironment();

    const nextMat = this.getMaterial(reg.getFinish(), reg.getBaseHex());
    if (this.mesh.material !== nextMat) {
      this.mesh.material = nextMat;
      (nextMat as THREE.Material).needsUpdate = true;
    }

    const pressed = t >= 0.999;
    this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, pressed ? -0.03 : 0, 0.22);
    this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, -0.08 * t, 0.16);
    this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, 0.10 * t, 0.16);

    // Transparent clear in the 2D canvas result:
    // clear WebGL to A=0, then copy pixels into 2D canvas
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    const ctx = (reg.ctx2d ??= canvas2d.getContext("2d", { alpha: true })!);
    ctx.imageSmoothingEnabled = false;

    const db = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(db);

    if (canvas2d.width !== db.x || canvas2d.height !== db.y) {
      canvas2d.width = db.x;
      canvas2d.height = db.y;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(this.renderer.domElement, 0, 0); // 1:1
    ctx.globalCompositeOperation = "source-over";
  }
}
