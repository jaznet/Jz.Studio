//jz-button-3d.component.ts

import { Component, HostBinding } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';

@Component({
  selector: 'jz-button-3d',
  standalone: true,
  templateUrl: './jz-button-3d.component.html',
  styleUrls: ['./jz-button-3d.component.scss']
})
export class JzButton3dComponent extends ButtonBase {
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;
  @HostBinding('attr.aria-disabled') ariaDisabled: string | null = null;

  onClick() {
    this.emitClicked();
  }
}
