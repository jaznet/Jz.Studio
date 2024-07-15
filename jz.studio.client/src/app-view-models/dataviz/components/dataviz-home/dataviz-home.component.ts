
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'dataviz-home',
  templateUrl: './dataviz-home.component.html',
  styleUrl: './dataviz-home.component.css'
})
export class DatavizHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
