import { Component, Input } from '@angular/core';

import { Direction } from '../../../../types/direction';
import { JzMenuContainerComponent } from '../../../../_components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../_components/menus/jz-menu-tab/jz-menu-tab.component';
import { MenuBaseComponent } from '../../../../_components/menus/jz-menu-base/jz-menu-base.component';

@Component({
  selector: 'sandbox-menu',
  standalone: true,
  imports: [JzMenuTabComponent, JzMenuContainerComponent],
  templateUrl: './sandbox-menu.component.html',
  styleUrls: ['./sandbox-menu.component.css']
})
export class SandboxMenuComponent extends MenuBaseComponent {
  @Input() override menuName = '';

  override direction: Direction = 'vertical';

  constructor() {
    super();

    this.menuType = 'main';
  }
}
