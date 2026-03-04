
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { normalizeMenuType, type MenuType } from '../../../../types/menu';
import { Direction } from '../../../../types/direction';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';

@Component({
  selector: 'sandbox-menu',
    standalone:true,
    imports: [JzMenuTabComponent, JzMenuContainerComponent],
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
