import { Component, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { Router } from '@angular/router';

@Component({
  selector: 'graphics-menu',
    standalone:true,
    imports: [JzMenuTabComponent, JzMenuContainerComponent],
    templateUrl: './graphics-menu.component.html',
    styleUrl: './graphics-menu.component.css'
})
export class GraphicsMenuComponent extends MenuBaseComponent {
  @Input() override menuName: string = '';

  constructor( router: Router) {
    super(router);
    this.menuType = 'sub';
    this.direction = 'vertical';
  }

}
