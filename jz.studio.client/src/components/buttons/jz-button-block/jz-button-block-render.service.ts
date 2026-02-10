// jz-button-block-render.service.ts

import { Injectable } from "@angular/core";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { makeButtonBlockGeometry, type RoundedButtonGeometryParams } from "./jz-button-block-geometry";
import {
  clearMaterialCache,
  getMaterialCacheSize,
  getOrCreateMaterialPreset,
  type JzButtonBlockFinish,
  type JzButtonMaterialOverrides,
} from "./jz-button-block-materials";

export type JzButtonBlockRegisterParams = {
  canvas2d: HTMLCanvasElement;
  canvas?: HTMLCanvasElement;

  // value-style geometry (optional)
  geom?: RoundedButtonGeometryParams;
  geometry?: RoundedButtonGeometryParams;
  geometryParams?: RoundedButtonGeometryParams;

  // getter-style geometry (optional)
  getGeom?: () => RoundedButtonGeometryParams;
  getGeometry?: () => RoundedButtonGeometryParams;
  getGeometryParams?: () => RoundedButtonGeometryParams;

  // finish/color
  getFinish?: () => JzButtonBlockFinish;
  finish?: JzButtonBlockFinish;

  getBaseHex?: () => string;
  baseHex?: string;

  // overrides
  getOverrides?: () => JzButtonMaterialOverrides | undefined;
  overrides?: JzButtonMaterialOverrides;

  // clear alpha
  getClearAlpha?: () => number | undefined;
  clearAlpha?: number;

  // interaction
  isActive?: () => boolean;
  getT?: () => number;
};

type Registration = {
  canvas: HTMLCanvasElement;
  params: JzButtonBlockRegisterParams;
};

@Injectable({ providedIn: "root" })
export class JzButtonBlockRenderService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;

  private mesh?: THREE.Mesh;
  private activeCanvas?: HTMLCanvasElement;
  private envTex?: THREE.Texture;
  private registrations = new Map<HTMLCanvasElement, Registration>();

  register(params: JzButtonBlockRegisterParams): () => void {
    const canvas = this.getCanvas(params);
    this.registrations.set(canvas, { canvas, params });

    if (!this.activeCanvas) {
      this.setActiveCanvas(canvas);
    } else if (this.activeCanvas === canvas) {
      this.setActiveCanvas(canvas);
    }

    return () => {
      this.registrations.delete(canvas);
      if (this.activeCanvas === canvas) this.maybeReleaseActive(canvas);
    };
  }

  setActiveCanvas(canvas: HTMLCanvasElement): void {
    this.activeCanvas = canvas;
    this.ensureInitForCanvas(canvas);

    const reg = this.registrations.get(canvas);
    if (!reg) return;

    this.applyParams(reg.params);
    this.snapshot(canvas);
  }

  snapshot(canvas: HTMLCanvasElement): void {
    // Lazy init if called directly before init happened
    if (!this.renderer || !this.scene || !this.camera || this.renderer.domElement !== canvas) {
      this.ensureInitForCanvas(canvas);
    }
    if (!this.renderer || !this.scene || !this.camera) return;

    const reg = this.registrations.get(canvas);
    const alpha = this.resolveClearAlpha(reg?.params);
    this.renderer.setClearAlpha(alpha);

    this.renderer.render(this.scene, this.camera);
  }

  maybeReleaseActive(canvas: HTMLCanvasElement): void {
    if (this.activeCanvas !== canvas) return;

    const next = this.registrations.keys().next();
    if (!next.done) {
      this.setActiveCanvas(next.value);
      return;
    }

    this.dispose();
  }

  // -------------------------
  // Resolve helpers
  // -------------------------

  private getCanvas(params: JzButtonBlockRegisterParams): HTMLCanvasElement {
    return params.canvas2d ?? params.canvas!;
  }

  private resolveGeom(params?: any): RoundedButtonGeometryParams {
    const p = params ?? {};

    const g =
      (typeof p.getGeom === "function" ? p.getGeom() : undefined) ??
      (typeof p.getGeometry === "function" ? p.getGeometry() : undefined) ??
      (typeof p.getGeometryParams === "function" ? p.getGeometryParams() : undefined) ??
      p.geom ??
      p.geometry ??
      p.geometryParams;

    if (g && typeof g === "object") {
      return {
        width: Number(g.width ?? 1.6),
        height: Number(g.height ?? 0.96),
        depth: Number(g.depth ?? 0.24),
        radius: Number(g.radius ?? 0.20),
        fillet: Number(g.fillet ?? 0.08),
        segments: g.segments != null ? Number(g.segments) : 18,
      };
    }

    return {
      width: 1.6,
      height: 0.96,
      depth: 0.24,
      radius: 0.20,
      fillet: 0.08,
      segments: 18,
    };
  }

  private resolveFinish(params?: JzButtonBlockRegisterParams): JzButtonBlockFinish {
    if (params?.getFinish) return params.getFinish();
    if (params?.finish) return params.finish;
    return "bakeliteSatin";
  }

  private resolveBaseHex(params?: JzButtonBlockRegisterParams): string {
    if (params?.getBaseHex) return params.getBaseHex();
    if (params?.baseHex) return params.baseHex;
    return "#553d36";
  }

  private resolveOverrides(params?: JzButtonBlockRegisterParams): JzButtonMaterialOverrides {
    if (!params) return {};
    if (params.getOverrides) return params.getOverrides() ?? {};
    return params.overrides ?? {};
  }

  private resolveClearAlpha(params?: JzButtonBlockRegisterParams): number {
    const a = params?.getClearAlpha ? params.getClearAlpha() : params?.clearAlpha;
    return a ?? 0;
  }

  // -------------------------
  // Internal implementation
  // -------------------------

  private ensureInitForCanvas(canvas: HTMLCanvasElement): void {
    if (!this.renderer) {
      const dpr = Math.min(globalThis.window?.devicePixelRatio ?? 1, 2);

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });

      // Renderer config FIRST
      this.renderer.setPixelRatio(dpr);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;

      // Create scene ONCE
      this.scene = new THREE.Scene();

      // Environment reflections (IBL) for MeshPhysicalMaterial
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();

      const envScene = new RoomEnvironment() as unknown as THREE.Scene;
      this.envTex = pmrem.fromScene(envScene, 0.04).texture;

      this.scene.environment = this.envTex;
      // keep background transparent: do NOT set this.scene.background

      pmrem.dispose();

      // Face-on ortho camera (will be resized to pixels in resizeToCanvas)
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(0, 0, 0);

      // Minimal direct lights (IBL does most of the bevel work now)
      const key = new THREE.DirectionalLight(0xffffff, 1.25);
      key.position.set(4, 3, 6);
      const fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.35);
      this.scene.add(key, fill);
    }

    // Singleton renderer must match canvas
    if (this.renderer && this.renderer.domElement !== canvas) {
      this.disposeRendererOnly();
      this.ensureInitForCanvas(canvas);
      return;
    }

    this.resizeToCanvas(canvas);
  }

  private resizeToCanvas(canvas: HTMLCanvasElement): { cssW: number; cssH: number } {
    if (!this.renderer || !this.camera) return { cssW: 0, cssH: 0 };

    let cssW = canvas.clientWidth;
    let cssH = canvas.clientHeight;

    if (!cssW || cssW < 2 || !cssH || cssH < 2) {
      const aw = canvas.width;
      const ah = canvas.height;
      cssW = aw && aw >= 2 ? aw : 300;
      cssH = ah && ah >= 2 ? ah : 150;
    }

    // Backing store matches CSS pixels; DPR handled by renderer.setPixelRatio
    if (canvas.width !== cssW) canvas.width = cssW;
    if (canvas.height !== cssH) canvas.height = cssH;

    this.renderer.setSize(cssW, cssH, false);

    // Pixel-based ortho camera (1 world unit == 1 CSS px)
    const halfW = cssW * 0.5;
    const halfH = cssH * 0.5;

    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();

    return { cssW, cssH };
  }

  private applyParams(params: JzButtonBlockRegisterParams): void {
    if (!this.scene || !this.camera) return;

    const canvas = this.getCanvas(params);
    const { cssW, cssH } = this.resizeToCanvas(canvas);     // Ensure size/camera are correct BEFORE generating geometry
    const finish = this.resolveFinish(params);
    const baseHex = this.resolveBaseHex(params);
    const overrides = this.resolveOverrides(params);
    const pad = 6; // px    // Geometry defined by design-time canvas size (CSS px)
    const w = Math.max(2, cssW - pad * 2);
    const h = Math.max(2, cssH - pad * 2);
    const radius = Math.min(18, Math.min(w, h) * 0.28);
    const fillet = Math.min(10, radius * 0.45);

    const geomParams: RoundedButtonGeometryParams = {
      width: w,
      height: h,
      depth: Math.min(24, Math.max(8, Math.min(w, h) * 0.22)),
      radius,
      fillet,
      segments: 18,
    };

    const geom = makeButtonBlockGeometry(geomParams);
    const debugNormals = true; // toggle
    const { mat } = getOrCreateMaterialPreset(finish, baseHex, {
      ...overrides,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      specularIntensity: 1.0,
      envMapIntensity: 2.0,
    });


    const useMat: THREE.Material = debugNormals
      ? new THREE.MeshNormalMaterial()
      : mat;

    console.log("[jz-btn-block] material cache", {
      size: getMaterialCacheSize(),
      finish,
      baseHex,
    });


    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geom, useMat);
      this.scene.add(this.mesh);
    } else {
      const oldGeom = this.mesh.geometry as THREE.BufferGeometry;
      this.mesh.geometry = geom;
      oldGeom.dispose();
      this.mesh.material = useMat;
    }

    // Center in pixel space
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.scale.set(1, 1, 1);
  }

  private disposeRendererOnly(): void {
    if (!this.renderer) return;
    this.renderer.dispose();
    this.renderer = undefined;
  }

  private dispose(): void {
    if (this.mesh) {
      (this.mesh.geometry as THREE.BufferGeometry).dispose();
      this.mesh = undefined;
    }
    this.scene = undefined;
    this.camera = undefined;

    this.disposeRendererOnly();
    this.activeCanvas = undefined;
    this.envTex?.dispose();
    this.envTex = undefined;
    clearMaterialCache(true);
  }
}

// Optional: keep old imports working
export type { JzButtonBlockFinish } from "./jz-button-block-materials";
