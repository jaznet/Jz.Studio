//jz-button-3d.component.ts

import { Component, HostBinding } from '@angular/core';
import { JzButtonBaseDirective } from '../jz-button/jz-button-base.directive';

@Component({
  selector: 'jz-button-3d',
  standalone: true,
  templateUrl: './jz-button-3d.component.html',
  styleUrls: ['./jz-button-3d.component.scss']
})
export class JzButton3dComponent extends JzButtonBaseDirective {
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;


}
