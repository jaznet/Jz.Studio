import { Component, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';

@Component({
  selector: 'graphics-menu',
  templateUrl: './graphics-menu.component.html',
  styleUrl: './graphics-menu.component.css'
})
export class GraphicsMenuComponent extends MenuBaseComponent {
  @Input() override menuName: string = '';

  override menuType: string = 'sub-menu';
  override direction: string = 'vertical';
}
