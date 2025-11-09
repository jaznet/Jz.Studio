// src/assets/worklets/jz-bevel-corner-worklet.js
registerPaint('jz-bevel-corner', class {
  static get inputProperties() {
    return ['--corner', '--r', '--base', '--c1', '--c2', '--wl-debug'];
  }

  paint(ctx, geom, props) {
    // Hit this to *prove* execution and to pause in DevTools:
    if ((props.get('--wl-debug') + '').trim() === '1') {
      debugger;                     // <-- DevTools will stop here (Sources > Worklets)
      ctx.fillStyle = '#ff00aa';    // magenta fill: obvious
      ctx.fillRect(0, 0, geom.width, geom.height);
      return;
    }

    // ...your real painting code (rings/arc)...
    const corner = (props.get('--corner') + '').trim() || 'tr';
    const r = parseFloat((props.get('--r') + '').replace(/[^\d.]/g, '')) || 6;
    const base = this._toColor(props.get('--base') + '', '#888');
    const c1 = this._toColor(props.get('--c1') + '', '#fff');
    const c2 = this._toColor(props.get('--c2') + '', '#000');

    let cx, cy, a0, a1, lightFirst;
    switch (corner) {
      case 'tr': cx = geom.width; cy = 0; a0 = Math.PI; a1 = Math.PI * 1.5; lightFirst = true; break;
      case 'br': cx = geom.width; cy = geom.height; a0 = Math.PI * 1.5; a1 = Math.PI * 2; lightFirst = false; break;
      case 'bl': cx = 0; cy = geom.height; a0 = 0; a1 = Math.PI * 0.5; lightFirst = false; break;
      default: cx = 0; cy = 0; a0 = Math.PI * 0.5; a1 = Math.PI; lightFirst = true; break;
    }

    const steps = Math.max(12, Math.floor(r));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const edge = lightFirst ? c1 : c2;
      const col = this._lerpColor(edge, base, t);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${col.a})`;
      const rr = r * t;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rr, a0, a1);
      ctx.closePath();
      ctx.fill();
    }
  }

  _toColor(s, fallback) {
    if (!s) s = fallback;
    if (s[0] === '#') {
      const v = s.slice(1);
      const hex = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
      const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(',').map(v => parseFloat(v.trim()));
      return { r: p[0], g: p[1], b: p[2], a: isNaN(p[3]) ? 1 : p[3] };
    }
    return this._toColor(fallback, '#888');
  }
  _lerp(a, b, t) { return a + (b - a) * t; }
  _lerpColor(a, b, t) { return { r: Math.round(this._lerp(a.r, b.r, t)), g: Math.round(this._lerp(a.g, b.g, t)), b: Math.round(this._lerp(a.b, b.b, t)), a: this._lerp(a.a, b.a, t) }; }
});
