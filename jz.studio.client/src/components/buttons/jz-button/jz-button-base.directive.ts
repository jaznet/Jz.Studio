/* jz-button=base.directive.ts*/

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { JzButtonSize, JzButtonVariant, JzTone, JzButtonTokens } from '../../../_framework/ui/buttons/_core/jz-button-types';
import { Router, UrlTree } from '@angular/router';

@Directive()
export abstract class JzButtonBaseDirective {
  // ---------- Public API (shared across all skins) ----------
  @Input() route?: string | any[] | UrlTree;
  @Input() queryParams?: Record<string, any>;
  @Input() fragment?: string;
  @Input() replaceUrl = false;
  /** Width/height can be '150px', '10rem', '100%', etc. */
  @Input() width?: string;
  @Input() height?: string;
  @Input() ariaLabel?: string;
  @Input() variant: JzButtonVariant = 'primary';
  @Input() size: JzButtonSize = 'md';
  @Input() tone: JzTone = 1;

  @Input() disabled = false;
  @Input() loading = false;

  /** Optional overrides */
  @Input() radiusPx?: number;
  @Input() bevelPx?: number;
  @Input() elevation?: number;

  /** Mirrors native <button type=""> */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<MouseEvent>();

  // ---------- Host bindings (classes + attributes) ----------

  @HostBinding('class.jz-btn') protected readonly hostClass = true;
  @HostBinding('class.is-disabled') get isDisabledClass() { return this.disabled; }
  @HostBinding('class.is-loading') get isLoadingClass() { return this.loading; }
  @HostBinding('class') get variantSizeClasses(): string {
    // Keep base class always present; add variant & size classes
    return [
      'jz-btn',
      `v-${this.variant}`,
      `s-${this.size}`,
      `t-${this.tone}`,
      this.disabled ? 'is-disabled' : '',
      this.loading ? 'is-loading' : '',
    ].filter(Boolean).join(' ');
  }

  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled ? 'true' : null;
  }

  // If host is a <button>, bind native attributes too
  @HostBinding('attr.disabled') get nativeDisabledAttr() {
    return this.disabled ? '' : null;
  }

  @HostBinding('attr.type') get nativeTypeAttr() {
    return this.type;
  }

  protected hovered = false;
  protected pressed = false;
  protected focused = false;

  constructor(
    protected readonly elRef: ElementRef<HTMLElement>,
    protected readonly r2: Renderer2,
    protected readonly router: Router
  ) { }

  // ---------- Events / State model ----------

  @HostListener('mouseenter') onEnter() {
    if (this.disabled) return;
    this.hovered = true;
    this.applyTokens();
  }

  @HostListener('mouseleave') onLeave() {
    this.hovered = false;
    this.pressed = false;
    this.applyTokens();
  }

  @HostListener('mousedown') onDown() {
    if (this.disabled) return;
    this.pressed = true;
    this.applyTokens();
  }

  @HostListener('mouseup') onUp() {
    this.pressed = false;
    this.applyTokens();
  }

  @HostListener('focus') onFocus() {
    this.focused = true;
    this.applyTokens();
  }

  @HostListener('blur') onBlur() {
    this.focused = false;
    this.applyTokens();
  }

  @HostListener('click', ['$event'])
  onClick(ev: MouseEvent) {
    if (this.disabled || this.loading) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      return;
    }

    // ✅ if route provided, button navigates even when used standalone
    if (this.route) {
      ev.preventDefault();

      if (typeof this.route === 'string') {
        this.router.navigateByUrl(this.route.startsWith('/') ? this.route : '/' + this.route);
      } else if (Array.isArray(this.route)) {
        this.router.navigate(this.route, { queryParams: this.queryParams, fragment: this.fragment, replaceUrl: this.replaceUrl });
      } else {
        this.router.navigateByUrl(this.route);
      }
      return;
    }

    this.clicked.emit(ev);
  }

  // ---------- Tokens ----------

  /** Skins can override if they need different defaults */
  protected computeTokens(): JzButtonTokens {
    const radiusPx = this.radiusPx ?? 10;

    // Cuboid default bevel by size (overrideable)
    const bevelPx =
      this.bevelPx ??
      (this.size === 'sm' ? 3 : this.size === 'md' ? 4 : 5);

    const elevation =
      this.elevation ??
      (this.size === 'sm' ? 1 : this.size === 'md' ? 2 : 2);

    // Pull from palette slots; skins can interpret these
    const bg = `var(--plt-clr-${this.tone})`;
    const fg = `var(--plt-txt-${this.tone})`;
    const border = `color-mix(in oklab, ${bg} 70%, black 30%)`;

    // focus ring token (keep it stable across skins)
    const focusRing = `color-mix(in oklab, ${bg} 55%, white 45%)`;

    return { bg, fg, border, radiusPx, bevelPx, elevation, focusRing };
  }

  /**
   * Applies tokens as CSS vars on the host element.
   * Skins consume vars in their SCSS.
   */
  protected applyTokens(): void {
    const t = this.computeTokens();

    const host = this.elRef.nativeElement;

    this.r2.setStyle(host, '--jz-bg', t.bg);
    this.r2.setStyle(host, '--jz-fg', t.fg);
    this.r2.setStyle(host, '--jz-border', t.border);

    this.r2.setStyle(host, '--jz-radius', `${t.radiusPx}px`);
    this.r2.setStyle(host, '--jz-bevel', `${t.bevelPx}px`);
    this.r2.setStyle(host, '--jz-elev', `${t.elevation}`);

    this.r2.setStyle(host, '--jz-focus-ring', t.focusRing);

    // state flags as vars (handy for CSS transitions)
    this.r2.setStyle(host, '--jz-hover', this.hovered ? 1 : 0);
    this.r2.setStyle(host, '--jz-press', this.pressed ? 1 : 0);
    this.r2.setStyle(host, '--jz-focus', this.focused ? 1 : 0);

    this.applySizeVars();
  }

  /** Call once after inputs are set (skins can call in ngOnInit / ngOnChanges) */
  protected initTokens(): void {
    this.applySizeVars();   // ✅ ensure defaults are present
    this.applyTokens();     // your existing token application
  }

  protected applySizeVars(): void {
    const host = this.elRef.nativeElement;

    // defaults
    this.r2.setStyle(host, '--jz-w', this.width?.trim() || '150px');
    this.r2.setStyle(host, '--jz-h', this.height?.trim() || '30px');
  }


}
