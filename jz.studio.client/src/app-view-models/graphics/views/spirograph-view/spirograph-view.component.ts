
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'spirograph-view',
  templateUrl: './spirograph-view.component.html',
  styleUrl: './spirograph-view.component.css'
})
export class SpirographViewComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
