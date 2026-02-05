// jz-button-block-part.ts

import { BlockMatParams, MaterialCache, normalizeHex } from "./jz-button-block-materials";
import * as THREE from "three";

export class JzButtonBlockPart {
  private mesh: THREE.Mesh;
  private currentMatParams: BlockMatParams | null = null;

  constructor(private mats: MaterialCache, mesh: THREE.Mesh) {
    this.mesh = mesh;
  }

  setMaterial(p: BlockMatParams): void {
    // No-op if params didn’t change
    if (this.currentMatParams && sameParams(this.currentMatParams, p)) return;

    // release old
    if (this.currentMatParams) this.mats.release(this.currentMatParams);

    // acquire new
    const mat = this.mats.acquire(p);
    this.mesh.material = mat;

    this.currentMatParams = { ...p }; // copy, don’t keep external reference
  }

  dispose(): void {
    if (this.currentMatParams) {
      this.mats.release(this.currentMatParams);
      this.currentMatParams = null;
    }
    // geometry disposal handled elsewhere as you prefer
  }
}

function sameParams(a: BlockMatParams, b: BlockMatParams): boolean {
  return (
    normalizeHex(a.baseHex) === normalizeHex(b.baseHex) &&
    a.envId === b.envId &&
    a.toneMapped === b.toneMapped &&
    a.metalness === b.metalness &&
    a.roughness === b.roughness
  );
}
