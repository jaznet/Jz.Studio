import { Directive, HostBinding, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuType } from '../../../types/menu';

@Directive()
export abstract class ButtonBase implements OnChanges {
  protected router = inject(Router);

  @Input() route = '';
  @Input() menuType: MenuType = 'none';
  @Input() isSelected: boolean = false;

  @Input() text = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() emphasis: 'primary' | 'neutral' | 'accent' = 'primary';

  @Input() width: string | number | null = '125px';
  @Input() height: string | number | null = '30';
  @Input() bevelWidth: number = 4;
  @Input('bevelwidth') set bevelwidthAlias(v: number) { this.bevelWidth = v; }

  @Output() clicked = new EventEmitter<void>();

  private _cssWidth = 'auto';
  private _cssHeight = 'auto';
  private _cssBevel = '8px';

  get cssWidth() { return this._cssWidth; }
  get cssHeight() { return this._cssHeight; }
  get cssBevel() { return this._cssBevel; }

  @HostBinding('style.width') get hostWidth() { return this.cssWidth; }
  @HostBinding('style.height') get hostHeight() { return this.cssHeight; }

  @HostBinding('style.--jz-w') get hostVarW() { return this.cssWidth; }
  @HostBinding('style.--jz-h') get hostVarH() { return this.cssHeight; }
  @HostBinding('style.--jz-bevel') get hostVarBevel() { return this.cssBevel; }

  @HostBinding('class.jz-btn--sm') get _sizeSm() { return this.size === 'sm'; }
  @HostBinding('class.jz-btn--lg') get _sizeLg() { return this.size === 'lg'; }
  @HostBinding('class.jz-btn--primary') get _emphPrimary() { return this.emphasis === 'primary'; }
  @HostBinding('class.jz-btn--neutral') get _emphNeutral() { return this.emphasis === 'neutral'; }
  @HostBinding('class.jz-btn--accent') get _emphAccent() { return this.emphasis === 'accent'; }
  @HostBinding('class.jz-btn-host') readonly _hostTag = true;

  ngOnChanges(_: SimpleChanges): void {
    this.applySizeVars();
  }

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

  /** Call from concrete button component */
  protected onActivated(): void {
    if (this.disabled) return;

    this.clicked.emit();

    const r = (this.route ?? '').trim();
    if (!r) return;

    // Normalize to absolute
    const url = r.startsWith('/') ? r : `/${r}`;
    this.router.navigateByUrl(url);
  }
}
