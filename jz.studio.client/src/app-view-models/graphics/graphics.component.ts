import { Component, HostBinding } from '@angular/core';


@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent {
  @HostBinding('class') classes = 'fit-to-parent ';
}
