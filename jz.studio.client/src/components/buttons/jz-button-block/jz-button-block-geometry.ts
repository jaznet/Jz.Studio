// jz-button-block-geometry.ts
import * as THREE from "three";

export type RoundedButtonGeometryParams = {
  width: number;    // X size
  height: number;   // Y size
  depth: number;    // Z thickness (centered about 0)
  radius: number;   // corner radius in XY (outer silhouette)
  fillet: number;   // edge fillet radius (quarter-circle from top to side)
  segments?: number; // fillet & corner segments (12–24 typical)
};

/**
 * Analytic rounded-rectangle "slab" with a true quarter-circle fillet on the TOP edge.
 *
 * Regions are built explicitly:
 *  - Top face (flat) -> normals (0,0,1)
 *  - Fillet (quarter-cylinder swept around rounded rect) -> normals are radial from fillet center
 *  - Side wall (vertical) -> normals are XY outward
 *
 * This avoids "averaged normals across hard edges" artifacts that ExtrudeGeometry bevels often produce.
 */
export function makeButtonBlockGeometry(p: RoundedButtonGeometryParams): THREE.BufferGeometry {
  const w = p.width;
  const h = p.height;
  const d = p.depth;

  const R = p.radius;
  const f = p.fillet;

  const seg = Math.max(4, Math.floor(p.segments ?? 18));

  // Clamp to safe ranges
  const halfW = w * 0.5;
  const halfH = h * 0.5;

  // Outer corner radius can't exceed half extents.
  const outerR = Math.min(R, halfW, halfH);

  // Fillet can't exceed outer radius, and can't exceed depth (so it doesn't invert)
  const fillet = Math.min(f, outerR, d * 0.5);

  // "Top plateau" (flat center) inset by fillet distance.
  // This ensures the fillet meets the top face cleanly.
  const topInset = fillet;

  // The vertical wall begins below the fillet:
  const zTop = d * 0.5;
  const zFilletBottom = zTop - fillet; // where fillet meets the vertical wall

  // The top face boundary (in XY) is the outer rounded rect inset by topInset
  const topR = Math.max(0, outerR - topInset);

  // Side wall outer silhouette radius remains outerR at all z along the wall.
  // (The fillet transitions from topR at zTop to outerR at zFilletBottom.)

  // Helpers
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const addVertex = (x: number, y: number, z: number, nx: number, ny: number, nz: number, u: number, v: number) => {
    positions.push(x, y, z);
    normals.push(nx, ny, nz);
    uvs.push(u, v);
    return (positions.length / 3) - 1;
  };

  // Build a 2D rounded-rect perimeter as a polyline (closed), with radius 'r'.
  // Returns points in CCW order.
  const roundedRectPerimeter = (rx: number, ry: number, r: number, cornerSeg: number) => {
    // rectangle half extents
    const hw = rx;
    const hh = ry;
    const rad = Math.min(r, hw, hh);

    const pts: THREE.Vector2[] = [];

    // 4 corners centers
    const cx = hw - rad;
    const cy = hh - rad;

    // Angles for each corner (CCW):
    // top-right: 0..90 -> (cx, cy)
    // top-left: 90..180 -> (-cx, cy)
    // bottom-left: 180..270 -> (-cx, -cy)
    // bottom-right: 270..360 -> (cx, -cy)

    const pushArc = (centerX: number, centerY: number, a0: number, a1: number) => {
      for (let i = 0; i <= cornerSeg; i++) {
        const t = i / cornerSeg;
        const a = THREE.MathUtils.lerp(a0, a1, t);
        const x = centerX + rad * Math.cos(a);
        const y = centerY + rad * Math.sin(a);
        pts.push(new THREE.Vector2(x, y));
      }
    };

    // Start at (hw - rad, hh) going CCW
    pushArc(cx, cy, 0, Math.PI * 0.5);           // top-right
    pushArc(-cx, cy, Math.PI * 0.5, Math.PI);     // top-left
    pushArc(-cx, -cy, Math.PI, Math.PI * 1.5);     // bottom-left
    pushArc(cx, -cy, Math.PI * 1.5, Math.PI * 2); // bottom-right

    // Remove last point because it's same as first (closed)
    pts.pop();
    return pts;
  };

  // Simple UV mapping helper for top
  const topUV = (x: number, y: number) => {
    // map to [0,1] based on full width/height
    return { u: (x / w) + 0.5, v: (y / h) + 0.5 };
  };

  // --- 1) TOP FACE (flat) as a triangle fan from center ---
  // Top face perimeter uses inset rounded rect (topR), and inset extents (halfW - topInset, halfH - topInset).
  const topHW = Math.max(0, halfW - topInset);
  const topHH = Math.max(0, halfH - topInset);
  const topPts = roundedRectPerimeter(topHW, topHH, topR, seg);

  const topCenter = addVertex(0, 0, zTop, 0, 0, 1, 0.5, 0.5);
  const topRing: number[] = [];

  for (const p2 of topPts) {
    const { u, v } = topUV(p2.x, p2.y);
    topRing.push(addVertex(p2.x, p2.y, zTop, 0, 0, 1, u, v));
  }

  for (let i = 0; i < topRing.length; i++) {
    const a = topCenter;
    const b = topRing[i];
    const c = topRing[(i + 1) % topRing.length];
    indices.push(a, b, c);
  }

  // --- 2) FILLET BAND (quarter-circle) ---
  // We sweep a quarter-circle profile in Z and XY outward normal direction.
  //
  // For each perimeter sample we build a small strip in "t" from 0..1:
  //  t=0: on top face boundary (z=zTop, XY=top perimeter)
  //  t=1: at fillet bottom (z=zFilletBottom, XY=outer perimeter)
  //
  // The normal at each t is the quarter-circle normal:
  //  nZ = cos(theta), nOut = sin(theta)
  // where theta from 0 (top) -> 90deg (side).
  //
  // Outward direction in XY is computed from the perimeter tangent.

  // Outer perimeter at the wall start
  const outerPts = roundedRectPerimeter(halfW, halfH, outerR, seg);

  // Sanity: topPts and outerPts lengths match (same seg)
  const nPer = Math.min(topPts.length, outerPts.length);

  // Build rings for each fillet step
  const filletRings: number[][] = [];

  for (let s = 0; s <= seg; s++) {
    const t = s / seg;
    const theta = t * (Math.PI / 2); // 0..90deg
    const nz = Math.cos(theta);
    const nOutScale = Math.sin(theta);

    const ring: number[] = [];

    for (let i = 0; i < nPer; i++) {
      const ptTop = topPts[i];
      const ptOut = outerPts[i];

      // Interpolate XY from top boundary to outer boundary
      const x = THREE.MathUtils.lerp(ptTop.x, ptOut.x, t);
      const y = THREE.MathUtils.lerp(ptTop.y, ptOut.y, t);

      // Interpolate Z from zTop to zFilletBottom
      const z = THREE.MathUtils.lerp(zTop, zFilletBottom, t);

      // Compute outward normal direction in XY from local edge direction.
      // Use neighbors to estimate tangent, then outward = perpendicular pointing away from center.
      const prev = outerPts[(i - 1 + nPer) % nPer];
      const next = outerPts[(i + 1) % nPer];
      const tx = next.x - prev.x;
      const ty = next.y - prev.y;

      // outward approx = normalize(perp(tangent)) with sign chosen to point away from center
      let ox = -ty;
      let oy = tx;

      const lenO = Math.hypot(ox, oy) || 1;
      ox /= lenO; oy /= lenO;

      // Ensure outward points away from origin (center)
      const dot = ox * x + oy * y;
      if (dot < 0) { ox = -ox; oy = -oy; }

      const nx = ox * nOutScale;
      const ny = oy * nOutScale;

      // Normal is (nx, ny, nz) — already unit because (nOutScale^2 + nz^2 == 1)
      // but nx/ny depend on outward direction (unit), so OK.
      const uv = topUV(x, y);
      ring.push(addVertex(x, y, z, nx, ny, nz, uv.u, uv.v));
    }

    filletRings.push(ring);
  }

  // Connect fillet rings into quads (two triangles per segment)
  for (let s = 0; s < seg; s++) {
    const A = filletRings[s];
    const B = filletRings[s + 1];

    for (let i = 0; i < nPer; i++) {
      const i2 = (i + 1) % nPer;

      const a = A[i];
      const b = A[i2];
      const c = B[i2];
      const d0 = B[i];

      indices.push(a, b, c);
      indices.push(a, c, d0);
    }
  }

  // --- 3) SIDE WALL (vertical) from zFilletBottom down to -d/2 ---
  const zBottom = -d * 0.5;

  const wallTopRing: number[] = [];
  const wallBotRing: number[] = [];

  for (let i = 0; i < nPer; i++) {
    const p2 = outerPts[i];

    // Outward normal in XY = normalized position direction adjusted for rounded rect
    // Better: compute from neighbors (same as above) so corners behave nicely.
    const prev = outerPts[(i - 1 + nPer) % nPer];
    const next = outerPts[(i + 1) % nPer];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;

    let ox = -ty;
    let oy = tx;

    const lenO = Math.hypot(ox, oy) || 1;
    ox /= lenO; oy /= lenO;

    const dot = ox * p2.x + oy * p2.y;
    if (dot < 0) { ox = -ox; oy = -oy; }

    const uv = topUV(p2.x, p2.y);
    wallTopRing.push(addVertex(p2.x, p2.y, zFilletBottom, ox, oy, 0, uv.u, uv.v));
    wallBotRing.push(addVertex(p2.x, p2.y, zBottom, ox, oy, 0, uv.u, uv.v));
  }

  for (let i = 0; i < nPer; i++) {
    const i2 = (i + 1) % nPer;

    const a = wallTopRing[i];
    const b = wallTopRing[i2];
    const c = wallBotRing[i2];
    const d0 = wallBotRing[i];

    indices.push(a, b, c);
    indices.push(a, c, d0);
  }

  // (Optional) Bottom face could be added similarly if you ever need it. For now it's not visible.

  const g = new THREE.BufferGeometry();
  g.setIndex(indices);
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  g.computeBoundingBox();
  g.computeBoundingSphere();

  return g;
}
