
import { Component } from '@angular/core';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { JzNavItem } from '../../../../_framework/navigation/models/jz-nav-item.model';
import { JzNavGroupComponent } from '../../../../_framework/navigation/components/jz-nav-group-component/jz-nav-group.component';

@Component({
  selector: 'visualization-menu',
  standalone: true,
  imports: [JzMenuContainerComponent, JzMenuTabComponent, JzNavGroupComponent],
  templateUrl: './visualization-menu.component.html',
  styleUrl: './visualization-menu.component.css'
})
export class VisualizationMenuComponent extends MenuBaseComponent {
  subNavItems: JzNavItem[] = [
    { id: 'home', label: 'Home', route: '/visualization' },
    { id: 'techanTs', label: 'TechanTs', route: '/visualization/techanTs' },
    { id: 'chorodash', label: 'Chorodash', route: '/visualization/chorodash' },
    { id: 'sankey', label: 'Sankey', route: '/visualization/sankey' },
    { id: 'bubbleChart', label: 'Bubble Chart', route: '/visualization/bubble-chart' },
    { id: 'syncfusionChart', label: 'Syncfusion Chart', route: '/visualization/syncfusion-chart' }
  ];

}
