// jz-button-cuboid.ts

import { Component, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';

@Component({
  selector: 'jz-button-cuboid',
  standalone: true,
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase {
  // wrapper out of a11y tree; the <button> is the real control
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;
  @HostBinding('attr.aria-disabled') ariaDisabled: string | null = null;

  constructor(el: ElementRef, renderer: Renderer2) {
    super();
    renderer.removeAttribute(el.nativeElement, 'role');
    renderer.removeAttribute(el.nativeElement, 'tabindex');
    renderer.removeAttribute(el.nativeElement, 'aria-disabled');
  }

  onClick() {
    console.log('button', this.route);
    this.emitClicked();
  }
}
