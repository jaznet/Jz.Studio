// jz-button-block-geometry.ts
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// If you already have this, keep using yours.
function makeRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const w = width;
  const h = height;
  const r = Math.min(radius, Math.min(w, h) * 0.5);

  const x = -w / 2;
  const y = -h / 2;

  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  shape.closePath();

  return shape;
}

/**
 * Computes vertex normals with a crease angle: faces meeting at angles larger than `creaseAngleRad`
 * will NOT be smoothed together (hard edge), which prevents bevel->side normal bleeding artifacts.
 */
function computeCreasedVertexNormals(
  geom: THREE.BufferGeometry,
  creaseAngleRad: number
): void {
  // Ensure indexed geometry so adjacency exists
  const indexed =
    geom.index ? geom : BufferGeometryUtils.mergeVertices(geom, 1e-6);

  const pos = indexed.getAttribute("position") as THREE.BufferAttribute;
  if (!pos) return;

  const index = indexed.getIndex()!;
  const triCount = index.count / 3;

  // Face normals
  const faceNormals: THREE.Vector3[] = new Array(triCount);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();

  for (let f = 0; f < triCount; f++) {
    const i0 = index.getX(f * 3 + 0);
    const i1 = index.getX(f * 3 + 1);
    const i2 = index.getX(f * 3 + 2);

    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);

    ab.subVectors(b, a);
    ac.subVectors(c, a);

    const n = new THREE.Vector3().crossVectors(ab, ac).normalize();
    faceNormals[f] = n;
  }

  // Build vertex -> faces adjacency
  const vertFaceLists: number[][] = Array.from({ length: pos.count }, () => []);
  for (let f = 0; f < triCount; f++) {
    const i0 = index.getX(f * 3 + 0);
    const i1 = index.getX(f * 3 + 1);
    const i2 = index.getX(f * 3 + 2);
    vertFaceLists[i0].push(f);
    vertFaceLists[i1].push(f);
    vertFaceLists[i2].push(f);
  }

  const cosCrease = Math.cos(creaseAngleRad);

  // For each corner of each triangle, compute a normal by averaging only faces within crease angle.
  // That requires splitting vertices when a vertex belongs to multiple smoothing groups.
  // We do this by "unindexing" to per-triangle vertices, computing per-corner normals, then reindexing.
  const nonIndexed = indexed.toNonIndexed();
  const nPos = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
  const outNormals = new Float32Array(nPos.count * 3);

  // Map nonIndexed vertex -> original indexed vertex id + face id:
  // Since toNonIndexed preserves triangle order, vertex k belongs to face floor(k/3), corner (k%3).
  const accum = new THREE.Vector3();

  for (let k = 0; k < nPos.count; k++) {
    const f = Math.floor(k / 3);

    // Original indexed vertex id for this corner:
    const origVert = index.getX(f * 3 + (k % 3));

    const base = faceNormals[f];

    accum.set(0, 0, 0);
    const facesAtV = vertFaceLists[origVert];

    for (let j = 0; j < facesAtV.length; j++) {
      const fj = facesAtV[j];
      const nj = faceNormals[fj];

      // Only include faces whose normal is within crease angle of the current face normal.
      if (base.dot(nj) >= cosCrease) {
        accum.add(nj);
      }
    }

    accum.normalize();

    outNormals[k * 3 + 0] = accum.x;
    outNormals[k * 3 + 1] = accum.y;
    outNormals[k * 3 + 2] = accum.z;
  }

  nonIndexed.setAttribute("normal", new THREE.BufferAttribute(outNormals, 3));

  // Reindex to reduce vertex count while preserving creases (normals differ across hard edges)
  const reindexed = BufferGeometryUtils.mergeVertices(nonIndexed, 1e-6);
  reindexed.computeBoundingBox();
  reindexed.computeBoundingSphere();

  // Mutate original geometry in place-ish: copy attributes/index over
  geom.copy(reindexed);
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

  /** Optional: crease angle in degrees. Default tuned for bevel blocks. */
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
  // Use crease-aware normals instead of plain computeVertexNormals()
  // This prevents bevel->side normal bleeding that creates the “shadow halo” at the silhouette.
  const creaseDeg = params.creaseAngleDeg ?? 35; // sweet spot for your bevel proportions
  computeCreasedVertexNormals(geom, THREE.MathUtils.degToRad(creaseDeg));

  return geom;
}
