/*dataviz.component.ts*/

import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatavizMenuComponent } from './components/dataviz-menu/dataviz-menu.component';
import { PopoverHttpErrorComponent } from '../../library/jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopOver } from '../../components/jz-pop-over/jz-pop-over';

@Component({
  selector: 'app-dataviz',
  standalone: true,
  imports: [JzPopOver, DatavizMenuComponent, RouterOutlet, PopoverHttpErrorComponent, PopOverLoadingComponent],
  templateUrl: './dataviz.component.html',
  styleUrl: './dataviz.component.css'
})
export class DatavizComponent {
  @HostBinding('class') classes = 'fit-to-parent';

  popoverVisible = true;
  anchor!: HTMLElement;

  constructor() { }
}
