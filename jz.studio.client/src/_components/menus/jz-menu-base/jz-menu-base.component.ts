import { Component, HostBinding, Input } from '@angular/core';
import { normalizeMenuType, type MenuType } from '../../../types/menu';
import { Direction } from '../../../types/direction';
import { JzNavItem } from '../../../_framework/navigation/models/jz-nav-item.model';

@Component({
  selector: 'jz-menu-base',
  templateUrl: './jz-menu-base.component.html',
  styleUrls: ['./jz-menu-base.component.css'],
  standalone: true
})
export class MenuBaseComponent {
  private _menuType: MenuType = 'main';

  constructor() { }

  @Input() menuName = '';

  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }

  get menuType(): MenuType {
    return this._menuType;
  }

  @Input() direction: Direction = 'vertical';

  @Input() collapsed = false;

  @HostBinding('class.jz-menu-host')
  readonly hostClass = true;

  @HostBinding('class.jz-menu-host--collapsed')
  get collapsedClass(): boolean {
    return this.collapsed;
  }

  @HostBinding('attr.data-menu-type')
  get menuTypeAttr(): MenuType {
    return this.menuType;
  }


}
