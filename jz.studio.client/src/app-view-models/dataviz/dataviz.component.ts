import { Component, HostBinding } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { DatavizMenuComponent } from './components/dataviz-menu/dataviz-menu.component';
import { PopoverHttpErrorComponent } from '../../library/jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';

@Component({
    selector: 'app-dataviz',
    imports: [DatavizMenuComponent, RouterOutlet, PopoverHttpErrorComponent, PopOverLoadingComponent],
    templateUrl: './dataviz.component.html',
    styleUrl: './dataviz.component.css'
})
export class DatavizComponent {
  @HostBinding('class') classes = 'fit-to-parent';
  constructor() { }
}
