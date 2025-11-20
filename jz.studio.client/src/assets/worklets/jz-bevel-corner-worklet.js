/* jz-bevel-corner-worklet.js */
registerPaint('jz-corners-bd', class {
  static get inputProperties() {
    return [
      '--jz-radius', '--jz-bevel', '--jz-base-color',
      '--jz-edge-light', '--jz-edge-dark',
      '--jz-bd-strength', '--jz-bd-light-mix', '--jz-bd-dark-mix',
      '--jz-debug-bd'
    ];
  }

  paint(ctx, geom, props) {
    // -------- helpers
    const num = (k, d = 0) => {
      const raw = (props.get(k)?.toString() || '').trim();
      const v = parseFloat(raw); return Number.isFinite(v) ? v : d;
    };
    const str = (k, d = '') => (props.get(k)?.toString() || d).trim();

    const parseRGB = (c) => {
      if (!c) return null;
      c = c.replace(/\s+/g, '');
      let m = /^rgba?\((\d+),(\d+),(\d+)(?:,[^)]+)?\)$/.exec(c);
      if (m) return { r: +m[1], g: +m[2], b: +m[3] };
      if (c[0] === '#') {
        let h = c.slice(1);
        if (h.length === 3) h = h.split('').map(x => x + x).join('');
        if (h.length === 6) return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
      }
      return null;
    };
    const clamp8 = v => Math.max(0, Math.min(255, Math.round(v)));
    const mixTo = (rgb, target, p) => ({
      r: clamp8(rgb.r * (1 - p) + target.r * p),
      g: clamp8(rgb.g * (1 - p) + target.g * p),
      b: clamp8(rgb.b * (1 - p) + target.b * p),
    });
    const rgba = (rgb, a = 1) => `rgba(${clamp8(rgb.r)},${clamp8(rgb.g)},${clamp8(rgb.b)},${Math.max(0, Math.min(1, a))})`;

    // -------- geometry
    const w = geom.width, h = geom.height;
    const R = Math.max(0, num('--jz-radius', 8));
    const B = Math.max(0, num('--jz-bevel', 8));
    const rInner = Math.max(0, R - B);
    const rOuter = R;

    // -------- colors (robust against color-mix)
    const base = parseRGB(str('--jz-base-color', '#465e5a')) || { r: 70, g: 94, b: 90 };
    const lightMixP = Math.min(100, Math.max(0, num('--jz-bd-light-mix', 27)));
    const darkMixP = Math.min(100, Math.max(0, num('--jz-bd-dark-mix', 27)));
    const edgeLight = parseRGB(str('--jz-edge-light', '')) || mixTo(base, { r: 255, g: 255, b: 255 }, lightMixP / 100);
    const edgeDark = parseRGB(str('--jz-edge-dark', '')) || mixTo(base, { r: 0, g: 0, b: 0 }, darkMixP / 100);
    const strength = Math.max(0, num('--jz-bd-strength', 1));
    const debug = num('--jz-debug-bd', 0) > 0.5;

    const sector = (cx, cy, ri, ro, a0, a1) => {
      ctx.beginPath();
      ctx.arc(cx, cy, ro, a0, a1, false);
      ctx.arc(cx, cy, ri, a1, a0, true);
      ctx.closePath();
    };
    const radial = (cx, cy, ri, ro, rgb, inv = false) => {
      const g = ctx.createRadialGradient(cx, cy, ri, cx, cy, ro);
      if (!inv) {
        g.addColorStop(0.00, rgba(rgb, 0.18 * strength));
        g.addColorStop(0.55, rgba(rgb, 0.40 * strength));
        g.addColorStop(1.00, rgba(rgb, 0.00));
      } else { // darker falloff alternative
        g.addColorStop(0.00, rgba(rgb, 0.22 * strength));
        g.addColorStop(0.70, rgba(rgb, 0.06 * strength));
        g.addColorStop(1.00, rgba(rgb, 0.00));
      }
      ctx.fillStyle = g;
    };

    // -------- B = top-right (center = w-R, R). Use edgeLight.
    {
      const cx = w - R, cy = R;
      sector(cx, cy, rInner, rOuter, -Math.PI / 2, 0);
      if (debug) { ctx.fillStyle = '#ff00ff'; ctx.fill(); }
      else { radial(cx, cy, rInner, rOuter, edgeLight, false); ctx.globalCompositeOperation = 'lighter'; ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
    }

    // -------- D = bottom-left (center = R, h-R). Usually a light sweep too.
    {
      const cx = R, cy = h - R;
      sector(cx, cy, rInner, rOuter, Math.PI / 2, Math.PI);
      if (debug) { ctx.fillStyle = '#ff00ff'; ctx.fill(); }
      else { radial(cx, cy, rInner, rOuter, edgeLight, false); ctx.globalCompositeOperation = 'lighter'; ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
    }
  }
});
