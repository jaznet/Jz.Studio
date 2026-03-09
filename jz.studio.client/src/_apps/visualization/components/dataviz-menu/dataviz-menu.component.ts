
import { Component } from '@angular/core';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';

@Component({
  selector: 'dataviz-menu',
    standalone:true,
    imports: [JzMenuContainerComponent, JzMenuTabComponent],
    templateUrl: './dataviz-menu.component.html',
    styleUrl: './dataviz-menu.component.css'
})
export class DatavizMenuComponent extends MenuBaseComponent {

}
