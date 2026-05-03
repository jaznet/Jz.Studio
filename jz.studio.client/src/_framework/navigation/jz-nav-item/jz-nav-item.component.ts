import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JzNavItem } from '../models/jz-nav-item.model';

@Component({
  selector: 'jz-nav-item',
  standalone: true,
  templateUrl: './jz-nav-item.component.html',
  styleUrl: './jz-nav-item.component.scss'
})
export class JzNavItemComponent {
  @Input() item!: JzNavItem;
  @Input() active = false;
  @Input() disabled = false;

  @Output() selected = new EventEmitter<JzNavItem>();

  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.selected.emit(this.item);
  }
}
