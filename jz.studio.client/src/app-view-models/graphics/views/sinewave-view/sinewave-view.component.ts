
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'sinewave-view',
    templateUrl: './sinewave-view.component.html',
    styleUrl: './sinewave-view.component.css',
    standalone: false
})
export class SinewaveViewComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
