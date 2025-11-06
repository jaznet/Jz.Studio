// jz-button-cuboid.ts

import { Component, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';

@Component({
  selector: 'jz-button-cuboid', // use the tag you actually place in templates
  standalone: true,
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase {
  // make wrapper non-interactive & out of the a11y tree
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;
  @HostBinding('attr.aria-disabled') ariaDisabled: string | null = null;

  constructor(el: ElementRef, renderer: Renderer2) {
    super();
    // belt-and-suspenders: remove any attributes Angular might have inherited 
    renderer.removeAttribute(el.nativeElement, 'role');
    renderer.removeAttribute(el.nativeElement, 'tabindex');
    renderer.removeAttribute(el.nativeElement, 'aria-disabled');

    const cssAny = CSS as any; // or add the ambient .d.ts from earlier
    if (cssAny && 'paintWorklet' in cssAny) {
      cssAny.paintWorklet.addModule(
        new URL('./jz-bevel-corner.worklet.js', import.meta.url) // colocated
      );
    }
  }

  onClick() { this.emitClicked(); }
}
