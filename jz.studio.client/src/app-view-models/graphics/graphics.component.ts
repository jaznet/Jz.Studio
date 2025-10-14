import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphicsMenuComponent } from './components/graphics-menu/graphics-menu.component';


@Component({
    selector: 'app-graphics',
    imports: [CommonModule, RouterOutlet, GraphicsMenuComponent],
    templateUrl: './graphics.component.html',
    styleUrl: './graphics.component.css'
})
export class GraphicsComponent {
  @HostBinding('class') classes = 'fit-to-parent ';
}
