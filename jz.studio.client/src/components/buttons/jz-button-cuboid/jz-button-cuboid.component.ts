/*jz-button- cuboid.component.ts*/

import { ChangeDetectionStrategy, Component, ElementRef, inject, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { JzButtonBaseDirective } from '../jz-button/jz-button-base.directive';
import { JZ_MENU_CONTEXT } from '../../menus/jz-menu/jz-menu-context.token';
import { Router } from '@angular/router';

@Component({
  selector: 'jz-button-cuboid',
  standalone: true,
  templateUrl: './jz-button-cuboid.component.html',
  styleUrls: ['./jz-button-cuboid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JzButtonCuboidComponent extends JzButtonBaseDirective implements OnInit, OnChanges {

  private readonly menuCtx = inject(JZ_MENU_CONTEXT, { optional: true });

  //constructor(
  //  elRef: ElementRef<HTMLElement>,
  //  r2: Renderer2,
  //  router: Router
  //) {
  //  super(elRef, r2, router);
  //}

  ngOnInit(): void {
    this.initTokens();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).length) this.applyTokens();
  }

  protected override computeTokens() {
    const t = super.computeTokens();

    // standalone => menuCtx is null => unchanged
    const mt = this.menuCtx?.menuType;
    if (!mt) return t;

    if (mt === 'sub') {
      return { ...t, elevation: Math.max(0, t.elevation - 1) };
    }

    return t;
  }
}
