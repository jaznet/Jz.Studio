
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-graphics-home',
  templateUrl: './graphics-home.component.html',
  styleUrl: './graphics-home.component.css'
})
export class GraphicsHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
