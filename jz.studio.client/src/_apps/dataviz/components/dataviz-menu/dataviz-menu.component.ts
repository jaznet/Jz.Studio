
import { Component } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';
import { JzMenuTabComponent } from '../../../../library/jz-menu/jz-menu-tab/jz-menu-tab.component';

import { JzMenuContainerComponent } from '../../../../library/jz-menu/jz-menu-container/jz-menu-container.component';

@Component({
  selector: 'dataviz-menu',
    standalone:true,
    imports: [JzMenuContainerComponent, JzMenuTabComponent],
    templateUrl: './dataviz-menu.component.html',
    styleUrl: './dataviz-menu.component.css'
})
export class DatavizMenuComponent extends MenuBaseComponent {

}
