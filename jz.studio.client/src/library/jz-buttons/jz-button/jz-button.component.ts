import { Component, HostBinding, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { normalizeMenuType, type MenuType } from '../../../types/menu';

@Component({
  selector: 'jz-button',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './jz-button.component.html',
  styleUrls: ['./jz-button.component.scss']
})
export class JzButtonComponent {
  /** Router bits */
  @Input() route: string | any[] = '/';
  @Input() queryParams?: Record<string, any>;
  @Input() fragment?: string;
  @Input() exact = true;

  /** Visual/config */
  @Input() text = 'Enter';
  @Input() disabled = false;
  @Input() isSelected = false;

  /** Sizing API (applies to the host) */
  @Input() width?: number | string;
  @Input() height?: number | string;

  @HostBinding('style.width') get hostW() { return this.cssSize(this.width); }
  @HostBinding('style.height') get hostH() { return this.cssSize(this.height); }
  @HostBinding('attr.aria-disabled') get ariaDisabled() { return this.disabled ? 'true' : null; }

  /** Variant (main/sub) */
  private _menuType: MenuType = 'main';
  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }
  get menuType(): MenuType { return this._menuType; }

  /** Prevent navigation when disabled */
  onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  private cssSize(v?: number | string | null) {
    if (v == null || v === '') return null;
    return typeof v === 'number' ? `${v}px` : v;
  }
}
