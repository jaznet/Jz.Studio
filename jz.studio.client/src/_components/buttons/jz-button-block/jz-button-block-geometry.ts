// jz-button-block-geometry.ts
//
// Option A implementation: **Chamfer Ring**
// - Replaces the quarter-circle fillet band with a single flat beveled strip
//   between an inner (inset) top loop and the outer silhouette loop.
// - The chamfer ring normals intentionally have a +Z component so you get a
//   visible rim highlight even when viewing straight-on.
//
// Notes on parameters:
// - `fillet` is now interpreted as **bevelWidth** (the inset distance in XY).
// - `bevelDrop` is derived from bevelWidth + depth so you get a meaningful slope.
//   You can tune `BEVEL_DROP_FACTOR` below to taste (0.25–0.8 typical).

import * as THREE from "three";

export type RoundedButtonGeometryParams = {
  width: number;     // X size
  height: number;    // Y size
  depth: number;     // Z thickness (centered about 0)
  radius: number;    // corner radius in XY (outer silhouette)
  fillet: number;    // (repurposed) bevelWidth for chamfer ring
  segments?: number; // corner segments (12–24 typical)
};

/**
 * Analytic rounded-rectangle "slab" with a **chamfer ring** on the TOP edge.
 *
 * Regions are built explicitly:
 *  - Top face (flat) -> normals (0,0,1)
 *  - Chamfer ring (flat sloped strip) -> normals = outward+up (explicit)
 *  - Side wall (vertical) -> normals are XY outward
 *
 * This produces a visible rim highlight at straight-on view (what you asked for).
 */
export function makeButtonBlockGeometry(p: RoundedButtonGeometryParams): THREE.BufferGeometry {
  const w = p.width;
  const h = p.height;
  const d = p.depth;

  const R = p.radius;

  const seg = Math.max(4, Math.floor(p.segments ?? 18));

  // Clamp to safe ranges
  const halfW = w * 0.5;
  const halfH = h * 0.5;

  // Outer corner radius can't exceed half extents.
  const outerR = Math.min(R, halfW, halfH);

  // Chamfer ring width (XY inset). Re-using p.fillet to avoid breaking call sites.
  const bevelWidth = Math.max(0, Math.min(p.fillet, outerR, halfW, halfH));

  // How far down the chamfer drops from the top face before meeting the side wall.
  // Bigger drop => more grazing highlight band. Too big => chunky/overdone.
  const BEVEL_DROP_FACTOR = 0.55; // tweak: 0.25..0.80
  const bevelDrop = Math.max(0, Math.min(bevelWidth * BEVEL_DROP_FACTOR, d * 0.5));

  const zTop = d * 0.5;
  const zChamferBottom = zTop - bevelDrop; // where chamfer meets the vertical wall
  const zBottom = -d * 0.5;

  // Inner/top face boundary is the outer rounded rect inset by bevelWidth
  const topInset = bevelWidth;
  const topHW = Math.max(0, halfW - topInset);
  const topHH = Math.max(0, halfH - topInset);
  const topR = Math.max(0, outerR - topInset);

  // Helpers
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const addVertex = (
    x: number, y: number, z: number,
    nx: number, ny: number, nz: number,
    u: number, v: number
  ) => {
    positions.push(x, y, z);
    normals.push(nx, ny, nz);
    uvs.push(u, v);
    return (positions.length / 3) - 1;
  };

  // Build a 2D rounded-rect perimeter as a polyline (closed), with radius 'r'.
  // Returns points in CCW order.
  const roundedRectPerimeter = (rx: number, ry: number, r: number, cornerSeg: number) => {
    const hw = rx;
    const hh = ry;
    const rad = Math.min(r, hw, hh);

    const pts: THREE.Vector2[] = [];

    const cx = hw - rad;
    const cy = hh - rad;

    const pushArc = (centerX: number, centerY: number, a0: number, a1: number) => {
      for (let i = 0; i <= cornerSeg; i++) {
        const t = i / cornerSeg;
        const a = THREE.MathUtils.lerp(a0, a1, t);
        const x = centerX + rad * Math.cos(a);
        const y = centerY + rad * Math.sin(a);
        pts.push(new THREE.Vector2(x, y));
      }
    };

    pushArc(cx, cy, 0, Math.PI * 0.5);  // top-right
    pushArc(-cx, cy, Math.PI * 0.5, Math.PI);        // top-left
    pushArc(-cx, -cy, Math.PI, Math.PI * 1.5);  // bottom-left
    pushArc(cx, -cy, Math.PI * 1.5, Math.PI * 2.0);  // bottom-right

    pts.pop(); // remove duplicate closing point
    return pts;
  };

  // Simple UV mapping helper (top-projected)
  const topUV = (x: number, y: number) => {
    return { u: (x / w) + 0.5, v: (y / h) + 0.5 };
  };

  // Compute outward unit vector in XY for perimeter point i using neighbor tangents.
  const outwardXY = (loop: THREE.Vector2[], i: number, xRef: number, yRef: number) => {
    const n = loop.length;
    const prev = loop[(i - 1 + n) % n];
    const next = loop[(i + 1) % n];

    const tx = next.x - prev.x;
    const ty = next.y - prev.y;

    // perp(tangent)
    let ox = -ty;
    let oy = tx;

    const len = Math.hypot(ox, oy) || 1;
    ox /= len;
    oy /= len;

    // Make sure it points outward (away from origin-ish). Use ref point for sign.
    const dot = ox * xRef + oy * yRef;
    if (dot < 0) { ox = -ox; oy = -oy; }

    return { ox, oy };
  };

  // --- 1) TOP FACE (flat) as a triangle fan from center ---
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

  // --- 2) CHAMFER RING (flat sloped strip) ---
  // Outer perimeter at the silhouette
  const outerPts = roundedRectPerimeter(halfW, halfH, outerR, seg);

  const nPer = Math.min(topPts.length, outerPts.length);

  // We create a dedicated vertex strip (do NOT reuse topRing) so normals differ.
  const chamferInnerRing: number[] = [];
  const chamferOuterRing: number[] = [];

  // Chamfer normal formula (analytic):
  // n ∝ outward * bevelDrop  +  zHat * bevelWidth
  // -> ensures a stable +Z component and a controllable rim highlight.
  for (let i = 0; i < nPer; i++) {
    const ptIn = topPts[i];
    const ptOut = outerPts[i];

    // outward direction derived from OUTER loop (more stable at corners)
    const { ox, oy } = outwardXY(outerPts, i, ptOut.x, ptOut.y);

    const nx0 = ox * bevelDrop;
    const ny0 = oy * bevelDrop;
    const nz0 = bevelWidth;

    const inv = 1 / (Math.hypot(nx0, ny0, nz0) || 1);
    const nx = nx0 * inv;
    const ny = ny0 * inv;
    const nz = nz0 * inv;

    // Inner/top edge of chamfer (at top face boundary)
    {
      const uv = topUV(ptIn.x, ptIn.y);
      chamferInnerRing.push(addVertex(ptIn.x, ptIn.y, zTop, nx, ny, nz, uv.u, uv.v));
    }

    // Outer/bottom edge of chamfer (at outer silhouette, dropped)
    {
      const uv = topUV(ptOut.x, ptOut.y);
      chamferOuterRing.push(addVertex(ptOut.x, ptOut.y, zChamferBottom, nx, ny, nz, uv.u, uv.v));
    }
  }

  // Connect chamfer ring into quads (two triangles per segment)
  // Winding assumes loops are CCW and normals are outward+up.
  for (let i = 0; i < nPer; i++) {
    const j = (i + 1) % nPer;

    const a = chamferInnerRing[i];
    const b = chamferInnerRing[j];
    const c = chamferOuterRing[j];
    const d0 = chamferOuterRing[i];

    indices.push(a, b, c);
    indices.push(a, c, d0);
  }

  // --- 3) SIDE WALL (vertical) from zChamferBottom down to -d/2 ---
  const wallTopRing: number[] = [];
  const wallBotRing: number[] = [];

  for (let i = 0; i < nPer; i++) {
    const p2 = outerPts[i];

    const { ox, oy } = outwardXY(outerPts, i, p2.x, p2.y);

    const uv = topUV(p2.x, p2.y);
    wallTopRing.push(addVertex(p2.x, p2.y, zChamferBottom, ox, oy, 0, uv.u, uv.v));
    wallBotRing.push(addVertex(p2.x, p2.y, zBottom, ox, oy, 0, uv.u, uv.v));
  }

  for (let i = 0; i < nPer; i++) {
    const j = (i + 1) % nPer;

    const a = wallTopRing[i];
    const b = wallTopRing[j];
    const c = wallBotRing[j];
    const d0 = wallBotRing[i];

    indices.push(a, b, c);
    indices.push(a, c, d0);
  }

  // (Optional) Bottom face could be added if needed later.

  const g = new THREE.BufferGeometry();
  g.setIndex(indices);
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  g.computeBoundingBox();
  g.computeBoundingSphere();

  return g;
}
