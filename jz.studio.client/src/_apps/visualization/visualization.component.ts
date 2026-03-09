/*dataviz.component.ts*/

import { Component, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopoverHttpErrorComponent } from '../../library/jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopoversService } from '../../components/jz-pop-over/jz-popovers.service';
import { VisualizationMenuComponent } from './components/visualization-menu/visualization-menu.component';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [VisualizationMenuComponent, RouterOutlet, PopoverHttpErrorComponent, PopOverLoadingComponent],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css'
})
export class VisualizationComponent {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('popoverTpl') tpl!: TemplateRef<unknown>;

  isPopoverVisible = false;

  constructor(private popovers: JzPopoversService) { }

  togglePopover(origin: HTMLElement) {
    if (this.isPopoverVisible) {
      this.popovers.close();
      this.isPopoverVisible = false;
    } else {
      this.popovers.open(origin, this.tpl);
      this.isPopoverVisible = true;
    }
  }
}
