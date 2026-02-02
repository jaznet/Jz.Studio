// jz-button-block-geometry.ts
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function makeButtonBlockGeometry(params: {
  width: number;
  height: number;
  depth: number;

  /** Corner/edge fillet radius (acts like your “bevel” look) */
  radius: number;

  /** Smoothness of the fillet. 8–24 is typical. */
  segments?: number;

  /**
   * Optional: if you want the “side wall” to be minimal, keep radius close to depth/2.
   * (No explicit bevelSize/thickness needed anymore.)
   */
}): THREE.BufferGeometry {
  const seg = params.segments ?? 16;

  // IMPORTANT: RoundedBoxGeometry radius must be <= half of the smallest dimension
  const maxR = 0.5 * Math.min(params.width, params.height, params.depth);
  const r = Math.max(0, Math.min(params.radius, maxR - 1e-4));

  const geom = new RoundedBoxGeometry(params.width, params.height, params.depth, seg, r);

  // Center it (RoundedBoxGeometry is already centered, but keep consistent)
  geom.computeBoundingBox();
  const bb = geom.boundingBox!;
  const c = new THREE.Vector3();
  bb.getCenter(c);
  geom.translate(-c.x, -c.y, -c.z);

  // Normals are generally good, but safe to recompute
  geom.computeVertexNormals();

  return geom;
}
