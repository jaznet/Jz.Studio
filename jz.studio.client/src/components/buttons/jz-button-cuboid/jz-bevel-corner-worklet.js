// jz-bevel-corner.worklet.js
// PaintWorklet: quarter-arc bevel that blends between two edge tones.
// Use in CSS: background: paint(jz-bevel-corner);

registerPaint('jz-bevel-corner', class {
  static get inputProperties() {
    return [
      '--jz-base', '--lighter', '--darker', '--rim-light', '--rim-dark',
      '--corner',                // "A" | "B" | "C" | "D"
      '--radius',                // px (defaults to min(w,h))
      '--edge-start',            // "light" | "dark" (default per corner)
      '--edge-end',              // "light" | "dark" (default per corner)
      '--strength'               // 0..1, overall contrast (default .9)
    ];
  }

  // --- tiny color helpers ---------------------------------------------------
  parseColor(input, fallback) {
    const s = (input || '').toString().trim();
    if (s.startsWith('#')) {
      const h = s.slice(1);
      const n = h.length === 3
        ? h.split('').map(x => parseInt(x + x, 16))
        : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map(x => parseInt(x, 16));
      return { r: n[0], g: n[1], b: n[2], a: 1 };
    }
    const m = s.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const p = m[1].split(',').map(v => parseFloat(v));
      return { r: p[0], g: p[1], b: p[2], a: (p[3] ?? 1) };
    }
    return fallback || { r: 0, g: 0, b: 0, a: 1 };
  }
  lerp(a, b, t) { return a + (b - a) * t; }
  mix(c1, c2, t) {
    return {
      r: this.lerp(c1.r, c2.r, t), g: this.lerp(c1.g, c2.g, t), b: this.lerp(c1.b, c2.b, t),
      a: this.lerp((c1.a ?? 1), (c2.a ?? 1), t)
    };
  }
  css(c) { return `rgba(${c.r | 0},${c.g | 0},${c.b | 0},${c.a ?? 1})`; }

  // tone curve along radius (0 center → 1 outer arc)
  edgeTone(kind, base, lighter, darker, rim, t, strength) {
    // two-stage ramp for a rounded feel
    const mid = (kind === 'light') ? this.mix(rim, lighter, 0.6) : this.mix(rim, darker, 0.6);
    const shaped = Math.pow(Math.min(1, t), 0.9 + (1 - strength) * 0.6);
    return this.mix(mid, base, shaped);
  }

  paint(ctx, geom, props) {
    const W = geom.width, H = geom.height;

    // palette (with mild defaults)
    const base = this.parseColor(props.get('--jz-base'), { r: 70, g: 110, b: 105, a: 1 });
    const light = this.parseColor(props.get('--lighter'), { r: 115, g: 155, b: 150, a: 1 });
    const dark = this.parseColor(props.get('--darker'), { r: 35, g: 60, b: 55, a: 1 });
    const rimL = this.parseColor(props.get('--rim-light'), light);
    const rimD = this.parseColor(props.get('--rim-dark'), dark);

    const corner = (props.get('--corner')?.toString().trim() || 'A').toUpperCase();
    const R = parseFloat((props.get('--radius') || Math.min(W, H)).toString());
    const strength = Math.max(0, Math.min(1, parseFloat(props.get('--strength')) || 0.9));

    // Orientation per corner
    // - center (cx,cy) is the *inner* corner of the square cell
    // - angle range [a0..a1] defines the quarter we paint (clockwise)
    //   We also map which side is "start" vs "end" (top/left vs right/bottom)
    let cx, cy, a0, a1, defaultStart, defaultEnd;
    switch (corner) {
      case 'A': // top-left (sits against TOP + LEFT edges)  [light, light]
        cx = W; cy = H; a0 = Math.PI; a1 = 1.5 * Math.PI;
        defaultStart = 'light'; defaultEnd = 'light';
        break;
      case 'B': // top-right (TOP then RIGHT) [light -> dark]
        cx = 0; cy = H; a0 = 1.5 * Math.PI; a1 = 2 * Math.PI;
        defaultStart = 'light'; defaultEnd = 'dark';
        break;
      case 'C': // bottom-right (RIGHT + BOTTOM) [dark, dark]
        cx = 0; cy = 0; a0 = 0; a1 = 0.5 * Math.PI;
        defaultStart = 'dark'; defaultEnd = 'dark';
        break;
      case 'D': // bottom-left (BOTTOM then LEFT) [dark -> light]
      default:
        cx = W; cy = 0; a0 = 0.5 * Math.PI; a1 = Math.PI;
        defaultStart = 'dark'; defaultEnd = 'light';
        break;
    }
    const edgeStart = (props.get('--edge-start')?.toString().trim() || defaultStart).toLowerCase();
    const edgeEnd = (props.get('--edge-end')?.toString().trim() || defaultEnd).toLowerCase();

    // Render by sampling pixels (bevel cells are small; 1px step is fine)
    const step = 1;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        // angle normalized into this corner’s quadrant → u in [0..1]
        let ang = Math.atan2(y - cy, x - cx);         // -π..π
        if (ang < 0) ang += 2 * Math.PI;
        let u = (ang - a0) / (a1 - a0);
        if (u < 0 || u > 1) continue;                 // outside our quarter

        // radial 0..1 (inside the circle up to bevel radius)
        const r = Math.hypot(x - cx, y - cy) / R;
        if (r > 1) continue;

        // tone at each edge, then blend by arc-position u
        const t0 = this.edgeTone(edgeStart, base, light, dark, rimL, r, strength);
        const t1 = this.edgeTone(edgeEnd, base, light, dark, rimD, r, strength);
        const c = this.mix(t0, t1, u);

        ctx.fillStyle = this.css(c);
        ctx.fillRect(x, y, step, step);
      }
    }
  }
});
