import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

export type MenuType = 'main' | 'secondary' | 'utility';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Directive() // no template; extended by concrete @Components
export abstract class ButtonBase {
  /** Router is optional; child templates may also use [routerLink] directly */
  protected router = inject(Router, { optional: true });

  // ——— Public API (stable across skins) ————————————————
  @Input() text: string = 'Enter';
  @Input() route: string | any[] | null = null;   // programmatic fallback
  @Input() menuType: MenuType = 'main';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() isSelected = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  // ——— Accessibility / Host state ————————————————
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-disabled') get ariaDisabled() { return String(this.disabled); }
  @HostBinding('attr.tabindex') get tabIndex() { return this.disabled ? -1 : 0; }

  // Host classes others can style against
  @HostBinding('class.jz-btn-host') hostClass = true;
  @HostBinding('class.is-disabled') get clsDisabled() { return this.disabled; }
  @HostBinding('class.is-selected') get clsSelected() { return this.isSelected; }
  @HostBinding('class.sm') get clsSm() { return this.size === 'sm'; }
  @HostBinding('class.lg') get clsLg() { return this.size === 'lg'; }

  // ——— Unified click path: call from child template (click)="handleClick($event)" ———
  handleClick() {
    this.clicked.emit();
  }

  // Keyboard activation (space/enter) => click, for a11y
  @HostListener('keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (this.disabled) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      (ev.target as HTMLElement)?.click();
    }
  }
}
