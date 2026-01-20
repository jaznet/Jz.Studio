//jz-button-block-geometry.ts

import * as THREE from "three";

/**
 * Rounded-rect Shape in the XY plane, centered at (0,0).
 * w/h are full extents. r is corner radius.
 */
export function makeRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const x = -w / 2;
  const y = -h / 2;
  const radius = Math.min(r, w / 2, h / 2);

  const s = new THREE.Shape();
  s.moveTo(x + radius, y);
  s.lineTo(x + w - radius, y);
  s.quadraticCurveTo(x + w, y, x + w, y + radius);
  s.lineTo(x + w, y + h - radius);
  s.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  s.lineTo(x + radius, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - radius);
  s.lineTo(x, y + radius);
  s.quadraticCurveTo(x, y, x + radius, y);

  return s;
}

/**
 * Beveled rounded-rect "block" geometry centered at origin.
 * Depth is centered around Z=0 so lighting/camera remain stable.
 */
export function makeButtonBlockGeometry(params: {
  width: number;
  height: number;
  radius: number;
  depth: number;

  bevelSize: number;
  bevelThickness: number;

  curveSegments?: number;
  bevelSegments?: number;
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

  // Smooth shading
  geom.computeVertexNormals();

  return geom;
}
