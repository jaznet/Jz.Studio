/* visualization.component.ts */

import { Component, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VisualizationMenuComponent } from './components/visualization-menu/visualization-menu.component';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [VisualizationMenuComponent, RouterOutlet],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css'
})
export class VisualizationComponent  {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('popoverTpl') tpl!: TemplateRef<unknown>;

  isPopoverVisible = false;
  moduleMenuCollapsed = false;

  constructor() { }

  togglePopover(origin: HTMLElement): void {
  }


}
