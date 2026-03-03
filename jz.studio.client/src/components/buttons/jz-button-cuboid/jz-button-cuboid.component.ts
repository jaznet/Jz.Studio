/*jz-button- cuboid.component.ts*/

import { ChangeDetectionStrategy, Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { JzButtonBaseDirective } from '../jz-button/jz-button-base.directive';

@Component({
  selector: 'jz-button-cuboid',
  standalone: true,
  templateUrl: './jz-button-cuboid.component.html',
  styleUrls: ['./jz-button-cuboid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JzButtonCuboidComponent extends JzButtonBaseDirective implements OnInit, OnChanges {

  constructor(elRef: ElementRef<HTMLElement>, r2: Renderer2) {
    super(elRef, r2);
  }

  ngOnInit(): void {
    this.initTokens();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).length) this.applyTokens();
  }

}
