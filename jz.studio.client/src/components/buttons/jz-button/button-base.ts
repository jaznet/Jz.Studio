import { Directive, HostBinding, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MenuType } from '../../../types/menu';

@Directive()
// No template/host listeners here—derived components wire the inner <button>.
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

  /** Sizing inputs (numbers ⇒ px). Defaults: auto/auto/6px */
  @Input() width: string | number | null = '100px';
  @Input() height: string | number | null = '60px';
  @Input() bevelWidth: number =  8;
  /** kebab-case alias support: [bevelwidth] */
  @Input('bevelwidth') set bevelwidthAlias(v: number) { this.bevelWidth = v; }

  /** Primary click event (emit from the inner <button>) */
  @Output() clicked = new EventEmitter<void>();

  // button-base.ts

  /* ---------- Host-level CSS vars & classes shared by all buttons ---------- */

  /** CSS vars consumed by component stylesheets */
  get cssWidth() { return this.toCss(this.width, 'auto'); }
  get cssHeight() { return this.toCss(this.height, 'auto'); }
  get cssBevel() { return this.toCss(this.bevelWidth, '6px'); }

  @HostBinding('style.width') get hostWidth() { return this.cssWidth; }   // '100px' | 'auto'
  @HostBinding('style.height') get hostHeight() { return this.cssHeight; }  // '30px'  | 'auto'

  /** Common host classes for size/emphasis toggles (subclasses’ CSS can target these) */
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

  /** Subclasses should call this once in their constructor for initial values */
  protected applySizeVars(): void {
    //this.cssWidth = this.toCss(this.width, 'auto');
    //this._cssHeight = this.toCss(this.height, 'auto');
    //this._cssBevel = this.toCss(this.bevelWidth, '6px');
  }

  /** Utility: normalize string|number|null → css string */
  protected toCss(v: string | number | null | undefined, fallback: string): string {
    if (v === null || v === undefined || v === '') return fallback;
    if (typeof v === 'number') return `${v}px`;
    const s = String(v).trim();
    return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
  }

  /** Helper for derived templates */
  get hasText(): boolean { return !!this.text && this.text.trim().length > 0; }

  /** Call this from the inner <button>’s (click) */
  protected emitClicked(): void {
    if (!this.disabled) this.clicked.emit();
  }
}
