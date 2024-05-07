import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dataviz',
  templateUrl: './dataviz.component.html',
  styleUrl: './dataviz.component.css'
})
export class DatavizComponent {
  @HostBinding('class') classes = 'fit-to-parent';
  constructor() { }
}
