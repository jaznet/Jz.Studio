
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'choro-dash',
  templateUrl: './choro-dash.component.html',
  styleUrl: './choro-dash.component.css'
})
export class ChoroDashComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
