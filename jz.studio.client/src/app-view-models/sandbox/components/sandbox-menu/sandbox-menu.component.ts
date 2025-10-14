
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';
import { CommonModule } from '@angular/common';
import { normalizeMenuType, type MenuType } from '../../../../types/menu';
import { Direction } from '../../../../types/direction';
import { JzMenuTabComponent } from '../../../../library/jz-menu/jz-menu-tab/jz-menu-tab.component';
import { JzMenuContainerComponent } from '../../../../library/jz-menu/jz-menu-container/jz-menu-container.component';

@Component({
    selector: 'sandbox-menu',
    imports: [CommonModule, JzMenuTabComponent, JzMenuContainerComponent],
    templateUrl: './sandbox-menu.component.html',
    styleUrls: ['./sandbox-menu.component.css']
})
export class SandboxMenuComponent extends MenuBaseComponent  {

  @Input() override menuName: string = '';

  constructor() {
    super();
    this.menuType = 'main';
  }

  // override menuType: string = 'sub-menu';
  override direction: Direction = 'vertical';
 // override menuType: MenuType = 'main';
}
