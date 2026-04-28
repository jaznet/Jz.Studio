// jz-button.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuType } from '../../../../types/menu';

@Component({
  selector: 'jz-button',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './jz-button.html',
  styleUrl: './jz-button.scss'
})
export class JzButton {
  @Input() active = false;
  @Input() isSelected = false;
  @Input() route: string | any[] = '/';
  @Input() menuType: MenuType = 'main';
  @Input() text = 'Enter';

  // <-- fixes TS2339 when template references `navigate`
  @Input() navigate = true;

  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(ev: MouseEvent) {
    this.clicked.emit(ev);
  }
}
