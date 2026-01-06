// jz-button-cuboid.ts

import { AfterViewInit, Component, ElementRef, HostBinding, Renderer2, ViewChild } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';
import { select } from 'd3-selection';

@Component({
  selector: 'jz-button-cuboid', // use the tag you actually place in templates
  standalone: true,
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase implements AfterViewInit {
  // make wrapper non-interactive & out of the a11y tree
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;
  @HostBinding('attr.aria-disabled') ariaDisabled: string | null = null;

  @ViewChild('topRight', { static: false }) topRightRef!: ElementRef<HTMLElement>;


  constructor(el: ElementRef, renderer: Renderer2) {
    super();
    // belt-and-suspenders: remove any attributes Angular might have inherited 
    renderer.removeAttribute(el.nativeElement, 'role');
    renderer.removeAttribute(el.nativeElement, 'tabindex');
    renderer.removeAttribute(el.nativeElement, 'aria-disabled');
  }

    ngAfterViewInit(): void {
      const topRight = select(this.topRightRef.nativeElement);
    }

  onClick() { this.emitClicked(); }
}
