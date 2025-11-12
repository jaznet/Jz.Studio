// /assets/worklets/jz-cuboid.worklet.js
// Paint Worklet: soft glossy cuboid with correct short-axis bevel gradients.
// Use: background-image: paint(jz-cuboid);

(function () {
  /* ------------------------------- helpers -------------------------------- */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const px = (props, name, fallback) => {
    const s = String(props.get(name)?.toString() ?? "");
    const m = s.match(/-?\d*\.?\d+/);
    return m ? parseFloat(m[0]) : fallback;
  };
  const num = (props, name, fallback) => {
    const n = Number(props.get(name)?.toString());
    return Number.isFinite(n) ? n : fallback;
  };
  const col = (props, name, fallback) => (props.get(name)?.toString() || fallback);

  function roundedRectPath(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    const p = new Path2D();
    p.moveTo(x + r, y);
    p.lineTo(x + w - r, y);
    p.arcTo(x + w, y, x + w, y + r, r);
    p.lineTo(x + w, y + h - r);
    p.arcTo(x + w, y + h, x + w - r, y + h, r);
    p.lineTo(x + r, y + h);
    p.arcTo(x, y + h, x, y + h - r, r);
    p.lineTo(x, y + r);
    p.arcTo(x, y, x + r, y, r);
    p.closePath();
    return p;
  }

  // vertical face gradient (lighter top → darker bottom)
  function fillFaceGradient(ctx, path, base, up, down, height) {
    if (!isFinite(height) || height <= 0) return;
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0.00, up);
    g.addColorStop(0.50, base);
    g.addColorStop(1.00, down);
    ctx.fillStyle = g;
    ctx.fill(path);
  }

  registerPaint('jz-cuboid', class {
    static get inputProperties() {
      return [
        '--jz-radius', '--jz-bevel', '--jz-depth',
        '--jz-specular', '--jz-shade-strength', '--jz-press',
        '--jz-bg', '--jz-bg-strong', '--jz-bg-light',
        '--jz-edge-light', '--jz-edge-dark',
        '--jz-debug-bd'
      ];
    }

    paint(ctx, geom, props) {
      const w = Math.max(1, Math.floor(geom.width));
      const h = Math.max(1, Math.floor(geom.height));

      // geometry / tuning
      const radius = px(props, '--jz-radius', 3);   // default radius = 5px
      const bevel = px(props, '--jz-bevel', 3);
      const depth = px(props, '--jz-depth', 10);
      const spec = clamp(num(props, '--jz-specular', 0.08), 0, 1);
      const shadeK = clamp(num(props, '--jz-shade-strength', 0.14), 0, 1);
      const press = clamp(num(props, '--jz-press', 0), 0, 1);

      // palette (gentle defaults; your CSS tokens override)
      const cBase = col(props, '--jz-bg', '#4a5b57');
      const cBaseStrong = col(props, '--jz-bg-strong', '#3c4c48');
      const cBaseLight = col(props, '--jz-bg-light', '#5b6b67');
      const cEdgeLight = col(props, '--jz-edge-light', '#9fb5ae');
      const cEdgeDark = col(props, '--jz-edge-dark', '#26302e');

      const debugBD = num(props, '--jz-debug-bd', 0) > 0.5;

      const outerPath = roundedRectPath(0, 0, w, h, radius + bevel);
      const innerPath = roundedRectPath(bevel, bevel, w - 2 * bevel, h - 2 * bevel, radius);

      ctx.save();

      /* -------------------- Bevels (short-axis gradients, all 4 sides) ------------- */
      const b = bevel;

      // helper: paint a side strip with gradient across thickness b
      const paintBevelStrip = (side, outerCol, innerCol) => {
        ctx.save();
        // 1) keep inside the rounded outer shape
        ctx.clip(outerPath);

        // 2) clip to the side strip rectangle (thickness = b)
        const r = new Path2D();
        if (side === 'top') r.rect(0, 0, w, b);
        if (side === 'bottom') r.rect(0, h - b, w, b);
        if (side === 'left') r.rect(0, 0, b, h);
        if (side === 'right') r.rect(w - b, 0, b, h);
        ctx.clip(r);

        // 3) gradient perpendicular to edge (short dimension)
        let g;
        if (side === 'top') g = ctx.createLinearGradient(0, 0, 0, b);         // top → down
        if (side === 'bottom') g = ctx.createLinearGradient(0, h, 0, h - b);     // bottom → up
        if (side === 'left') g = ctx.createLinearGradient(0, 0, b, 0);         // left → right
        if (side === 'right') g = ctx.createLinearGradient(w, 0, w - b, 0);     // right → left

        g.addColorStop(0.00, outerCol);
        g.addColorStop(1.00, innerCol);
        ctx.fillStyle = g;

        // fill big rect; active clips restrict paint to the strip
        ctx.fillRect(0, 0, w, h);

        // 4) carve inner hole so only rim remains
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill(innerPath);

        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      };

      // Light hits from TL → brighten TOP & LEFT inward
      paintBevelStrip('top', cEdgeLight, cBaseLight);
      paintBevelStrip('left', cEdgeLight, cBaseLight);
      // Shadow at BR → darken RIGHT & BOTTOM inward
      paintBevelStrip('right', cEdgeDark, cBaseStrong);
      paintBevelStrip('bottom', cEdgeDark, cBaseStrong);

      /* -------------------------------- Face --------------------------------------- */
      fillFaceGradient(ctx, innerPath, cBase, cBaseLight, cBaseStrong, h);

      // faint ambient lift
      {
        const rg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.9);
        rg.addColorStop(0.0, 'rgba(255,255,255,0.015)');
        rg.addColorStop(1.0, 'rgba(0,0,0,0.05)');
        ctx.fillStyle = rg;
        ctx.fill(innerPath);
      }

      /* --------------------------- Specular band (soft) ----------------------------- */
      if (spec > 0.01) {
        const inset = bevel + Math.max(2, radius * 0.25);
        const bandH = Math.max(1.5, (h - inset * 2) * (0.10 - press * 0.04));
        const specPath = roundedRectPath(inset, inset, w - inset * 2, bandH, radius * 0.5);

        const sg = ctx.createLinearGradient(0, 0, 0, bandH);
        sg.addColorStop(0.0, `rgba(255,255,255, ${0.05 + spec * 0.12})`);
        sg.addColorStop(1.0, 'rgba(255,255,255, 0)');
        ctx.fillStyle = sg;
        ctx.fill(specPath);
      }

      /* ------------------------ Inner core shadow (BR) ----------------------------- */
      {
        const s = Math.max(2, depth * (0.3 + press * 0.2));
        const sh = ctx.createRadialGradient(w * 0.75, h * 0.75, 1, w * 0.85, h * 0.85, Math.max(w, h));
        sh.addColorStop(0, `rgba(0,0,0, ${0.06 + shadeK * 0.25})`);
        sh.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sh;
        ctx.fill(innerPath);
      }

      /* ----------------------------- Debug B & D ----------------------------------- */
      if (debugBD) {
        const k = Math.min(radius, Math.min(w, h) * 0.25);
        ctx.fillStyle = 'magenta';
        // B (bottom-left)
        const BL = new Path2D();
        BL.moveTo(0, h);
        BL.arcTo(0, h - k, k, h - k, k);
        BL.arcTo(k, h, 0, h, k);
        BL.closePath();
        ctx.fill(BL);
        // D (top-right)
        const TR = new Path2D();
        TR.moveTo(w, 0);
        TR.arcTo(w - k, 0, w - k, k, k);
        TR.arcTo(w, k, w, 0, k);
        TR.closePath();
        ctx.fill(TR);
      }

      ctx.restore();
    }
  });
})();
