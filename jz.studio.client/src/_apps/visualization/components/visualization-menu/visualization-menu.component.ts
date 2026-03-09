
import { Component } from '@angular/core';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';

@Component({
  selector: 'visualization-menu',
    standalone:true,
    imports: [JzMenuContainerComponent, JzMenuTabComponent],
    templateUrl: './visualization-menu.component.html',
    styleUrl: './visualization-menu.component.css'
})
export class VisualizationMenuComponent extends MenuBaseComponent {

}
