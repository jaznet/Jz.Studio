import { Directive, HostBinding, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MenuType } from '../../../types/menu';

@Directive()
export abstract class ButtonBase implements OnChanges {
  /* ---------- Public API (shared across all buttons) ---------- */
  @Input() route = '';
  @Input() menuType: MenuType = 'none';
  @Input() isSelected: boolean = false;

  /** Label text (optional; components may also project content) */
  @Input() text = '';

  /** Disabled state */
  @Input() disabled = false;

  /** Button type for the inner <button> */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /** Size & emphasis (common styling toggles) */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() emphasis: 'primary' | 'neutral' | 'accent' = 'primary';

  /** Sizing inputs (numbers ⇒ px). Defaults: auto/auto/8px */
  @Input() width: string | number | null = '100px';
  @Input() height: string | number | null = '60px';
  @Input() bevelWidth: number = 8;
  /** kebab-case alias support: [bevelwidth] */
  @Input('bevelwidth') set bevelwidthAlias(v: number) { this.bevelWidth = v; }

  /** Primary click event (emit from the inner <button>) */
  @Output() clicked = new EventEmitter<void>();

  /* ---------- CSS vars consumed by component stylesheets ---------- */

  private _cssWidth = 'auto';
  private _cssHeight = 'auto';
  private _cssBevel = '8px';

  get cssWidth() { return this._cssWidth; }
  get cssHeight() { return this._cssHeight; }
  get cssBevel() { return this._cssBevel; }

  /** Preserve your existing behavior */
  @HostBinding('style.width') get hostWidth() { return this.cssWidth; }
  @HostBinding('style.height') get hostHeight() { return this.cssHeight; }

  /** NEW: host CSS vars so different button implementations can share sizing */
  @HostBinding('style.--jz-w') get hostVarW() { return this.cssWidth; }
  @HostBinding('style.--jz-h') get hostVarH() { return this.cssHeight; }
  @HostBinding('style.--jz-bevel') get hostVarBevel() { return this.cssBevel; }

  /** Common host classes */
  @HostBinding('class.jz-btn--sm') get _sizeSm() { return this.size === 'sm'; }
  @HostBinding('class.jz-btn--lg') get _sizeLg() { return this.size === 'lg'; }
  @HostBinding('class.jz-btn--primary') get _emphPrimary() { return this.emphasis === 'primary'; }
  @HostBinding('class.jz-btn--neutral') get _emphNeutral() { return this.emphasis === 'neutral'; }
  @HostBinding('class.jz-btn--accent') get _emphAccent() { return this.emphasis === 'accent'; }
  @HostBinding('class.jz-btn-host') readonly _hostTag = true;

  /* ---------- Lifecycle ---------- */

  ngOnChanges(_: SimpleChanges): void {
    this.applySizeVars();
  }

  /** Subclasses can call this if they ever need to force-refresh sizes */
  protected applySizeVars(): void {
    this._cssWidth = this.toCss(this.width, 'auto');
    this._cssHeight = this.toCss(this.height, 'auto');
    this._cssBevel = this.toCss(this.bevelWidth, '8px');
  }

  protected toCss(v: string | number | null | undefined, fallback: string): string {
    if (v === null || v === undefined || v === '') return fallback;
    if (typeof v === 'number') return `${v}px`;
    const s = String(v).trim();
    return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
  }

  get hasText(): boolean { return !!this.text && this.text.trim().length > 0; }

  protected emitClicked(): void {
    if (!this.disabled) this.clicked.emit();
  }
}
