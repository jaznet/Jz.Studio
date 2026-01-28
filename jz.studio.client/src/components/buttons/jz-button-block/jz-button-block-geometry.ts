/* jz-button-block-geometry.ts
   - Builds a rounded-rect ExtrudeGeometry “button block”
   - Centers the geometry at origin
   - Computes crease-aware normals (pseudo “smoothing groups”) via a crease angle
*/

import * as THREE from "three";

/** Utility: create a rounded-rect Shape (centered at 0,0) */
export function makeRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const w = width;
  const h = height;
  const r = Math.min(radius, w / 2, h / 2);

  const x0 = -w / 2;
  const y0 = -h / 2;
  const x1 = +w / 2;
  const y1 = +h / 2;

  const s = new THREE.Shape();

  // Start at top-left corner (after radius)
  s.moveTo(x0 + r, y1);

  // Top edge -> top-right corner
  s.lineTo(x1 - r, y1);
  s.quadraticCurveTo(x1, y1, x1, y1 - r);

  // Right edge -> bottom-right corner
  s.lineTo(x1, y0 + r);
  s.quadraticCurveTo(x1, y0, x1 - r, y0);

  // Bottom edge -> bottom-left corner
  s.lineTo(x0 + r, y0);
  s.quadraticCurveTo(x0, y0, x0, y0 + r);

  // Left edge -> top-left corner
  s.lineTo(x0, y1 - r);
  s.quadraticCurveTo(x0, y1, x0 + r, y1);

  s.closePath();
  return s;
}

/**
 * Crease-aware normals:
 * - Converts to non-indexed triangles
 * - Computes per-face normals
 * - For each “same position” vertex, averages only neighboring face normals within crease angle
 *
 * This mimics “smoothing groups” enough to keep bevel smooth while keeping crisp breaks.
 */
function computeCreasedNormals(
  geometry: THREE.BufferGeometry,
  creaseAngleRad: number
): THREE.BufferGeometry {
  // Work on a non-indexed clone so each triangle has its own vertices
  const geom = geometry.index ? geometry.toNonIndexed() : geometry.clone();

  const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
  const positions = posAttr.array as Float32Array;

  // Compute per-face normals (one per triangle)
  const faceNormals: THREE.Vector3[] = [];
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i + 0], ay = positions[i + 1], az = positions[i + 2];
    const bx = positions[i + 3], by = positions[i + 4], bz = positions[i + 5];
    const cx = positions[i + 6], cy = positions[i + 7], cz = positions[i + 8];

    const abx = bx - ax, aby = by - ay, abz = bz - az;
    const acx = cx - ax, acy = cy - ay, acz = cz - az;

    // (AB x AC)
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;

    const n = new THREE.Vector3(nx, ny, nz).normalize();
    faceNormals.push(n);
  }

  // Bucket vertices by position (quantized) so we can average across coincident verts
  const hash = (x: number, y: number, z: number) =>
    `${x.toFixed(5)},${y.toFixed(5)},${z.toFixed(5)}`;

  const buckets = new Map<string, number[]>();
  for (let vi = 0; vi < posAttr.count; vi++) {
    const key = hash(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi));
    const arr = buckets.get(key);
    if (arr) arr.push(vi);
    else buckets.set(key, [vi]);
  }

  const normals = new Float32Array(posAttr.count * 3);
  const creaseCos = Math.cos(creaseAngleRad);

  // For each bucket: for each vertex, average only “similar” face normals
  for (const verts of buckets.values()) {
    for (const vi of verts) {
      const faceIndex = Math.floor(vi / 3); // 3 verts per triangle in non-indexed geometry
      const baseN = faceNormals[faceIndex];

      const sum = new THREE.Vector3(0, 0, 0);
      for (const vj of verts) {
        const fj = Math.floor(vj / 3);
        const nj = faceNormals[fj];
        if (baseN.dot(nj) >= creaseCos) sum.add(nj);
      }
      sum.normalize();

      normals[vi * 3 + 0] = sum.x;
      normals[vi * 3 + 1] = sum.y;
      normals[vi * 3 + 2] = sum.z;
    }
  }

  geom.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  return geom;
}

export function makeButtonBlockGeometry(params: {
  width: number;
  height: number;
  radius: number;
  depth: number;

  bevelSize: number;
  bevelThickness: number;

  curveSegments?: number;
  bevelSegments?: number;

  /** Pseudo “smoothing groups” control. 25–45 is typical. Default 35. */
  creaseAngleDeg?: number;
}): THREE.BufferGeometry {
  const shape = makeRoundedRectShape(params.width, params.height, params.radius);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: params.depth,
    steps: 1,

    curveSegments: params.curveSegments ?? 24,

    bevelEnabled: true,
    bevelSize: params.bevelSize,
    bevelThickness: params.bevelThickness,
    bevelSegments: params.bevelSegments ?? 10,
  });

  // Center geometry in X/Y and center depth around Z=0
  geom.computeBoundingBox();
  const bb = geom.boundingBox!;
  const center = new THREE.Vector3();
  bb.getCenter(center);
  geom.translate(-center.x, -center.y, -(bb.min.z + bb.max.z) / 2);

  // IMPORTANT:
  // Do NOT call mergeVertices()+computeVertexNormals() elsewhere after this,
  // or you’ll undo the crease behavior.
  const creaseDeg = params.creaseAngleDeg ?? 35;
  return computeCreasedNormals(geom, THREE.MathUtils.degToRad(creaseDeg));
}
