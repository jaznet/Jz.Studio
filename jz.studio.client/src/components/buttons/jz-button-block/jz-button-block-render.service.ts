/*jz-button-block-render.service.ts*/

import { Injectable, NgZone } from "@angular/core";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { makeButtonBlockGeometry } from "./jz-button-block-geometry";

export type JzButtonBlockFinish = "matte" | "anodized" | "glossy";

export type JzButtonBlockReg = {
  canvas2d: HTMLCanvasElement;

  getFinish: () => JzButtonBlockFinish;
  getBaseHex: () => string;

  /** True if this button should be "live" rendered (hover/focus/pressed). */
  isActive: () => boolean;

  /** 0 idle, ~0.6 hover/focus, 1 pressed. */
  getT: () => number;
};

@Injectable({ providedIn: "root" })
export class JzButtonBlockRenderService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private mesh!: THREE.Mesh;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.HemisphereLight;
  private rimLight!: THREE.DirectionalLight;

  private envTex!: THREE.Texture;

  private regs = new Map<HTMLCanvasElement, JzButtonBlockReg>();
  private activeCanvas?: HTMLCanvasElement;

  private rafId = 0;

  private geom?: THREE.BufferGeometry;
  private matCache = new Map<string, THREE.Material>();

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
  // Internals
  // -------------------------

  private ensureInit(): void {
    if (this.renderer) return;

    const dpr = Math.min((globalThis.window?.devicePixelRatio ?? 1), 2);

    // One shared WebGL renderer (not attached to any button canvas).
    // We copy its output into the active button's 2D canvas via drawImage().
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // required for drawImage(renderer.domElement)
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    // no physicallyCorrectLights line in r182

    this.scene = new THREE.Scene();

    // Environment (PMREM from RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.add(new RoomEnvironment());
    const env = new RoomEnvironment();
    this.envTex = pmrem.fromScene(envScene, 0.04).texture;
   
    pmrem.dispose();

    this.scene.environment = this.envTex;

    this.camera = new THREE.PerspectiveCamera(28, 1, 0.01, 10);
    this.camera.position.set(0.0, 0.0, 2.2);
    this.camera.lookAt(0, 0, 0);

    this.geom = makeButtonBlockGeometry({
      width: 1.8,
      height: 0.78,
      radius: 0.22,
      depth: 0.30,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 24,
      bevelSegments: 10,
    });

    this.mesh = new THREE.Mesh(this.geom, this.getMaterial("anodized", "#2f3440"));
    this.scene.add(this.mesh);

    // 3-light rig
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.05);
    this.keyLight.position.set(-1.2, 1.4, 1.0);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.HemisphereLight(0xffffff, 0x1a1f2a, 0.75);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.15);
    this.rimLight.position.set(1.2, 0.8, -1.4);
    this.scene.add(this.rimLight);
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
      // freeze and release
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

    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(devicePixelRatio || 1, 2);

    const rw = Math.max(1, Math.floor(cssW * dpr));
    const rh = Math.max(1, Math.floor(cssH * dpr));

    // Match renderer to this button size (only one active at a time => cheap)
    this.renderer.setSize(rw, rh, false);
    this.camera.aspect = rw / rh;
    this.camera.updateProjectionMatrix();

    // Finish + material
    const finish = reg.getFinish();
    const baseHex = reg.getBaseHex();
    this.mesh.material = this.getMaterial(finish, baseHex);

    // Finish-specific tuning
    if (finish === "matte") {
      this.renderer.toneMappingExposure = 1.0;
      this.keyLight.intensity = 2.2;
      this.rimLight.intensity = 1.3;
    } else if (finish === "anodized") {
      this.renderer.toneMappingExposure = 1.05;
      this.keyLight.intensity = 2.05;
      this.rimLight.intensity = 1.15;
    } else {
      this.renderer.toneMappingExposure = 1.15;
      this.keyLight.intensity = 1.9;
      this.rimLight.intensity = 1.25;
    }

    // Shared interaction animation (same code for all finishes)
    // pressed => small downshift, hover/focus => slight tilt
    const pressed = t >= 0.999;

    this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, pressed ? -0.03 : 0, 0.22);
    this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, -0.08 * t, 0.16);
    this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, 0.10 * t, 0.16);

    this.renderer.render(this.scene, this.camera);

    // Copy WebGL output into the button's 2D canvas
    const ctx = canvas2d.getContext("2d", { alpha: true })!;
    if (canvas2d.width !== rw || canvas2d.height !== rh) {
      canvas2d.width = rw;
      canvas2d.height = rh;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, rw, rh);
    ctx.drawImage(this.renderer.domElement, 0, 0, rw, rh);
  }

  private getMaterial(finish: JzButtonBlockFinish, hex: string): THREE.Material {
    const key = `${finish}|${hex}`;
    const cached = this.matCache.get(key);
    if (cached) return cached;

    let mat: THREE.MeshPhysicalMaterial;

    if (finish === "matte") {
      mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        metalness: 0.02,
        roughness: 0.68,
        reflectivity: 0.20,
        clearcoat: 0.06,
        clearcoatRoughness: 0.75,
        specularIntensity: 0.30,
      });
    } else if (finish === "anodized") {
      mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        metalness: 0.78,
        roughness: 0.34,
        reflectivity: 0.45,
        clearcoat: 0.25,
        clearcoatRoughness: 0.38,
        specularIntensity: 0.70,
      });
    } else {
      mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        metalness: 0.60,
        roughness: 0.18,
        reflectivity: 0.60,
        clearcoat: 0.70,
        clearcoatRoughness: 0.14,
        specularIntensity: 0.95,
      });
    }

    this.matCache.set(key, mat);
    return mat;
  }
}
