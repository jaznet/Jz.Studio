

import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'jz-choro-dash-panel',
    imports: [],
    templateUrl: './jz-choro-dash-panel.component.html',
    styleUrl: './jz-choro-dash-panel.component.css'
})
export class JzChoroDashPanelComponent {
  @HostBinding('class') classes = 'grid-row-fill';
}
