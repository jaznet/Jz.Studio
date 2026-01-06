// /assets/worklets/jz-corners-bd.js
// Paints beveled overlays for corners B (top-right) and D (bottom-left)
// in a way that blends with the left/top (LAT) and right/bottom (RCB) edges.

if (typeof registerPaint !== 'undefined') {
  class JZCornersBD {
    static get inputProperties() {
      return [
        '--jz-base-color',
        '--jz-radius',
        '--jz-bevel',
        '--jz-edge-light',
        '--jz-edge-dark',
        '--jz-bd-strength',   // 0..1, overall intensity
        '--jz-bd-light-mix',  // % white used if edge-light is color-mix(...)
        '--jz-bd-dark-mix',   // % black used if edge-dark is color-mix(...)
        '--jz-debug-bd'       // >0.5 = magenta debug fill
      ];
    }

    // ---------- helpers ----------------------------------------------------

    _str(props, name, fallback = '') {
      const v = props.get(name);
      return (v && v.toString().trim()) || fallback;
    }

    _num(props, name, fallback = 0) {
      const s = this._str(props, name, String(fallback));
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : fallback;
    }

    _parseRGB(color) {
      if (!color) return null;
      let c = color.toString().trim();

      // rgb/rgba(...)
      let m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(c);
      if (m) return { r: +m[1], g: +m[2], b: +m[3] };

      // #rgb or #rrggbb
      if (c[0] === '#') c = c.slice(1);
      if (c.length === 3) {
        const r = parseInt(c[0] + c[0], 16);
        const g = parseInt(c[1] + c[1], 16);
        const b = parseInt(c[2] + c[2], 16);
        return { r, g, b };
      }
      if (c.length === 6) {
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);
        return { r, g, b };
      }

      // Anything else (e.g. color-mix) → let caller fall back
      return null;
    }

    _clamp8(v) {
      return Math.max(0, Math.min(255, Math.round(v)));
    }

    _mix(a, b, t) {
      const u = 1 - t;
      return {
        r: this._clamp8(a.r * u + b.r * t),
        g: this._clamp8(a.g * u + b.g * t),
        b: this._clamp8(a.b * u + b.b * t)
      };
    }

    _rgba(rgb, a) {
      const alpha = Math.max(0, Math.min(1, a));
      return `rgba(${this._clamp8(rgb.r)},${this._clamp8(rgb.g)},${this._clamp8(rgb.b)},${alpha})`;
    }

    // ---------- main paint --------------------------------------------------

    paint(ctx, geom, props) {
      const w = geom.width;
      const h = geom.height;

      const radius = Math.max(0, this._num(props, '--jz-radius', 8));
      const bevel  = Math.max(0, this._num(props, '--jz-bevel', 8));
      const innerR = Math.max(0, radius - bevel);
      const outerR = radius;

      // Base + edge palette, robust against color-mix(...)
      const base =
        this._parseRGB(this._str(props, '--jz-base-color', '#465e5a')) ||
        { r: 70, g: 94, b: 90 };

      const lightMixP = this._num(props, '--jz-bd-light-mix', 25); // %
      const darkMixP  = this._num(props, '--jz-bd-dark-mix', 27);  // %

      const edgeLight =
        this._parseRGB(this._str(props, '--jz-edge-light', '')) ||
        this._mix(base, { r: 255, g: 255, b: 255 }, lightMixP / 100);

      const edgeDark =
        this._parseRGB(this._str(props, '--jz-edge-dark', '')) ||
        this._mix(base, { r: 0, g: 0, b: 0 }, darkMixP / 100);

      const strength = Math.max(0, Math.min(1, this._num(props, '--jz-bd-strength', 1)));
      const debug    = this._num(props, '--jz-debug-bd', 0) > 0.5;

      const paintCorner = (cx, cy, startAngle, endAngle, rgbStart, rgbEnd, invertFalloff) => {
        ctx.save();

        // Clip to quarter-ring (between inner & outer radii)
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, endAngle, false);
        ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
        ctx.closePath();
        ctx.clip();

        if (debug) {
          ctx.fillStyle = 'rgba(255,0,255,0.35)';
          ctx.fill();
          ctx.restore();
          return;
        }

        // Radial gradient from inner rim (near face) to outer rim (edge),
        // with 4 stops so it matches the "multi-bristle" brush idea.
        const g = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);

        // We treat t=0 at the join with the flat face and t=1 at the outer rim.
        // For LAT: inner is closer to base, outer pushes toward the brighter/darker edge.
        const mid = this._mix(rgbStart, rgbEnd, 0.5);

        if (!invertFalloff) {
          // Normal falloff: subtle near inner rim → stronger towards the edge.
          g.addColorStop(0.00, this._rgba(rgbStart, 0.00 * strength));
          g.addColorStop(0.35, this._rgba(rgbStart, 0.25 * strength));
          g.addColorStop(0.70, this._rgba(mid,      0.55 * strength));
          g.addColorStop(1.00, this._rgba(rgbEnd,   0.80 * strength));
        } else {
          // Inverted (used where the outer rim is *darker* than the face).
          g.addColorStop(0.00, this._rgba(rgbStart, 0.00 * strength));
          g.addColorStop(0.35, this._rgba(rgbStart, 0.40 * strength));
          g.addColorStop(0.70, this._rgba(mid,      0.60 * strength));
          g.addColorStop(1.00, this._rgba(rgbEnd,   0.90 * strength));
        }

        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      };

      // B (top-right) corner -----------------------------------------------
      // Adjacent edges: top (light) and right (dark).
      // We fade from the lighter side at the inner rim toward darker on the outer rim
      // so the highlight coming along the top wraps smoothly into the right edge shadow.
      paintCorner(
        w - radius,     // cx
        radius,         // cy
        -Math.PI / 2,   // startAngle (along top edge)
        0,              // endAngle   (along right edge)
        edgeLight,      // inner / toward light
        edgeDark,       // outer / toward dark
        true            // invert falloff, because the outer rim is darker
      );

      // D (bottom-left) corner ---------------------------------------------
      // Adjacent edges: left (light) and bottom (dark).
      // Here we want bottom shadow to wrap into the lighter left edge.
      paintCorner(
        radius,         // cx
        h - radius,     // cy
        Math.PI / 2,    // startAngle (along bottom edge)
        Math.PI,        // endAngle   (along left edge)
        edgeDark,       // inner / toward dark from the bottom
        edgeLight,      // outer / toward light on the left
        false           // normal falloff (outer rim brighter)
      );
    }
  }

  registerPaint('jz-corners-bd', JZCornersBD);
}
