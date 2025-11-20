// assets/worklets/jz-corners-bd.js
// Paints beveled overlays for corners B (top-right) and D (bottom-left)

if (typeof registerPaint !== "undefined") {
  class JZCornersBD {
    static get inputProperties() {
      return [
        '--jz-base-color',
        '--jz-edge-light',
        '--jz-edge-dark',
        '--jz-radius',
        '--jz-bevel',
        '--jz-corner-strength' // optional 0..1
      ];
    }

    // Helpers -------------------------------------------------------------
    read(props, name, fallback) {
      const v = props.get(name);
      return (v && v.toString().trim().length) ? v.toString().trim() : fallback;
    }
    px(props, name, fallback) {
      const v = this.read(props, name, String(fallback));
      const m = /(-?\d+(\.\d+)?)px/.exec(v);
      return m ? parseFloat(m[1]) : Number(v) || fallback;
    }
    hexToRgb(hex) {
      if (!hex || typeof hex !== 'string') return null;
      const s = hex.trim().toLowerCase();
      if (s.startsWith('rgb')) {
        // rgb/rgba already fine
        return null;
      }
      const m = s.replace('#', '');
      if (m.length === 3) {
        const r = parseInt(m[0] + m[0], 16);
        const g = parseInt(m[1] + m[1], 16);
        const b = parseInt(m[2] + m[2], 16);
        return { r, g, b };
      }
      if (m.length >= 6) {
        const r = parseInt(m.slice(0, 2), 16);
        const g = parseInt(m.slice(2, 4), 16);
        const b = parseInt(m.slice(4, 6), 16);
        return { r, g, b };
      }
      return null;
    }

    withAlpha(color, alpha) {
      const raw = String(color).trim();

      // If it contains "color-mix", "rgb(", or anything not simple hex — return as-is.
      if (/color-mix|\brgb/i.test(raw)) {
        return raw;
      }

      // Only accept plain #RRGGBB or RRGGBB
      const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(raw);
      if (!m) return raw;

      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);
      const a = Math.max(0, Math.min(1, alpha));

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }


    // Corner painters -----------------------------------------------------
    paintCornerTR(ctx, w, h, r, light, strength) {
      console.log('    - paintCornerTR', ctx,w,h,r,light,strength);
      // clip to quarter-circle in the top-right
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w - r, 0);
      ctx.closePath();
      ctx.clip();

      // Radial highlight emanating from the inner corner pivot
      const cx = w - r;
      const cy = r;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0.00, this.withAlpha(light, 0.16 * strength));
      grad.addColorStop(0.55, this.withAlpha(light, 0.06 * strength));
      grad.addColorStop(1.00, this.withAlpha(light, 0.00));
      ctx.fillStyle = grad;
      ctx.fillRect(w - r, 0, r, r);
      ctx.restore();
    }

    paintCornerBL(ctx, w, h, r, dark, strength) {
      // clip to quarter-circle in the bottom-left
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h - r);
      ctx.arcTo(0, h, r, h, r);
      ctx.lineTo(0, h - r);
      ctx.closePath();
      ctx.clip();

      // Radial shadow from inner pivot
      const cx = r;
      const cy = h - r;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0.00, this.withAlpha(dark, 0.20 * strength));
      grad.addColorStop(0.60, this.withAlpha(dark, 0.08 * strength));
      grad.addColorStop(1.00, this.withAlpha(dark, 0.00));
      ctx.fillStyle = grad;
      ctx.fillRect(0, h - r, r, r);
      ctx.restore();
    }

    paint(ctx, size, props) {
      console.log('    - JZCornersBD.paint called',ctx,size,props);
      const w = size.width, h = size.height;
      const r = Math.max(0, this.px(props, '--jz-radius', 8));
      // bevel informs how “wide” the corner impression should feel
      const bevel = Math.max(0, this.px(props, '--jz-bevel', 8));
      const light = this.read(props, '--jz-edge-light', '#ffffff');
      const dark = this.read(props, '--jz-edge-dark', '#000000');
      const strength = Math.min(1, Math.max(0, Number(this.read(props, '--jz-corner-strength', '1'))));

      // If the bevel is zero, nothing to paint
      if (bevel <= 0 || r <= 0) return;

      // B (top-right) highlight
      this.paintCornerTR(ctx, w, h, r, light, strength);

      // D (bottom-left) shadow
      this.paintCornerBL(ctx, w, h, r, dark, strength);
    }
  }

  registerPaint('jz-corners-bd', JZCornersBD);
}
