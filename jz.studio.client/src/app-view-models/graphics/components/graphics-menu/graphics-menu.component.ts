import { Component, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';
import { CommonModule } from '@angular/common';
import { JzMenuTabComponent } from '../../../../library/jz-menu/jz-menu-tab/jz-menu-tab.component';
import { JzMenuContainerComponent } from '../../../../library/jz-menu/jz-menu-container/jz-menu-container.component';

@Component({
    selector: 'graphics-menu',
    imports: [CommonModule, JzMenuTabComponent, JzMenuContainerComponent],
    templateUrl: './graphics-menu.component.html',
    styleUrl: './graphics-menu.component.css'
})
export class GraphicsMenuComponent extends MenuBaseComponent {
  @Input() override menuName: string = '';

  constructor() {
    super();
    this.menuType = 'sub';
    this.direction = 'vertical';
  }

}
