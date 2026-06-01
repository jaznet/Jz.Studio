
import { Component } from '@angular/core';
import { MenuBaseComponent } from '../../../../_components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../_components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../_components/menus/jz-menu-tab/jz-menu-tab.component';
import { JzNavItem } from '../../../../_framework/navigation/models/jz-nav-item.model';
import { JzNavGroupComponent } from '../../../../_framework/navigation/components/jz-nav-group-component/jz-nav-group.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'visualization-menu',
  standalone: true,
  imports: [CommonModule, JzMenuContainerComponent, JzMenuTabComponent, JzNavGroupComponent],
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
    { id: 'popover', label: 'Popover', route: '/visualization/popover' }
  ];

}
