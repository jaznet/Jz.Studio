import { Component, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';

@Component({
  selector: 'jz-button-3d',
  standalone: true,
  templateUrl: './jz-button-3d.component.html',
  styleUrls: ['./jz-button-3d.component.scss']
})
export class JzButton3dComponent extends ButtonBase {
  // Keep wrapper out of the a11y tree; the <button> is the real control
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
    this.emitClicked();
  }
}
