// src/components/buttons/jz-button-block/jz-button-block-render.service.ts

import { Injectable } from "@angular/core";
import * as THREE from "three";

import { makeButtonBlockGeometry, type RoundedButtonGeometryParams } from "./jz-button-block-geometry";
import {
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

  private registrations = new Map<HTMLCanvasElement, Registration>();

  register(params: JzButtonBlockRegisterParams): () => void {
    const canvas = this.getCanvas(params);
    this.registrations.set(canvas, { canvas, params });

    if (!this.activeCanvas) {
      this.setActiveCanvas(canvas); // applies + snapshots
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
    this.ensureInitForCanvas(canvas);
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
        height: Number(g.height ?? 0.7),
        depth: Number(g.depth ?? 0.2),
        radius: Number(g.radius ?? 0.18),
        fillet: Number(g.fillet ?? 0.06),
        segments: g.segments != null ? Number(g.segments) : 18,
      };
    }

    // Default geometry (in world units). Canvas size is controlled by @Input width/height.
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

      this.renderer.setPixelRatio(dpr);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;

      // Debug background (comment out later)
      // this.renderer.setClearColor(0x222222, 1);

      this.scene = new THREE.Scene();

      // Face-on ortho camera
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(0, 0, 0);

      // Minimal lighting (swap in your spotlight rig later)
      const key = new THREE.DirectionalLight(0xffffff, 2.0);
      key.position.set(4, 3, 6);
      const fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.55);
      this.scene.add(key, fill);
    }

    // If someone tries to use one singleton renderer across multiple canvases:
    // rebuild for the new canvas.
    if (this.renderer && this.renderer.domElement !== canvas) {
      this.disposeRendererOnly();
      this.ensureInitForCanvas(canvas);
      return;
    }

    this.resizeToCanvas(canvas);
  }

  private resizeToCanvas(canvas: HTMLCanvasElement): void {
    if (!this.renderer || !this.camera) return;

    let cssW = canvas.clientWidth;
    let cssH = canvas.clientHeight;

    // If CSS size isn't established yet, fall back to attributes or a sane default
    if (!cssW || cssW < 2 || !cssH || cssH < 2) {
      const aw = canvas.width;
      const ah = canvas.height;
      cssW = aw && aw >= 2 ? aw : 300;
      cssH = ah && ah >= 2 ? ah : 150;
    }

    // Keep backing store in sync with CSS pixels (pixelRatio handles DPR)
    if (canvas.width !== cssW) canvas.width = cssW;
    if (canvas.height !== cssH) canvas.height = cssH;

    this.renderer.setSize(cssW, cssH, false);

    const aspect = cssW / cssH;
    const viewH = 1;
    const viewW = viewH * aspect;

    this.camera.left = -viewW;
    this.camera.right = viewW;
    this.camera.top = viewH;
    this.camera.bottom = -viewH;
    this.camera.updateProjectionMatrix();
  }

  private applyParams(params: JzButtonBlockRegisterParams): void {
    if (!this.scene || !this.camera) return;

    const canvas = this.getCanvas(params);

    const geomParams = this.resolveGeom(params);
    const finish = this.resolveFinish(params);
    const baseHex = this.resolveBaseHex(params);
    const overrides = this.resolveOverrides(params);

    const geom = makeButtonBlockGeometry(geomParams);
    const { mat } = getOrCreateMaterialPreset(finish, baseHex, overrides);

    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geom, mat);
      this.scene.add(this.mesh);
    } else {
      const oldGeom = this.mesh.geometry as THREE.BufferGeometry;
      this.mesh.geometry = geom;
      oldGeom.dispose();

      this.mesh.material = mat;
    }

    this.fitMeshToView(canvas, geomParams.width, geomParams.height);
  }

  private fitMeshToView(canvas: HTMLCanvasElement, w: number, h: number): void {
    if (!this.mesh || !this.camera) return;

    const cw = canvas.clientWidth || canvas.width || 1;
    const ch = canvas.clientHeight || canvas.height || 1;

    const aspect = cw / ch;
    const viewH = this.camera.top - this.camera.bottom;
    const viewW = viewH * aspect;

    const pad = 0.10;
    const sx = (viewW * (1 - pad)) / (w || 1);
    const sy = (viewH * (1 - pad)) / (h || 1);
    const s = Math.min(sx, sy);

    this.mesh.scale.setScalar(s);
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
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
  }
}

// Optional: keep old imports working
export type { JzButtonBlockFinish } from "./jz-button-block-materials";
