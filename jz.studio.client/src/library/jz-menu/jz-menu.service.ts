
import { EventEmitter, Injectable, Output } from '@angular/core';
import { JzMenuTabComponent } from './jz-menu-tab/jz-menu-tab.component';
@Injectable({
  providedIn: 'root'
})
export class JzMenuService {
  @Output() menuItemSelectedEvent = new EventEmitter<JzMenuTabComponent>();
  @Output() menuItemDeselectedEvent = new EventEmitter<JzMenuTabComponent>();

  constructor() { }



  menuItemSelected(selected: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(selected);
  }

  tabSelected(tab: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(tab);
  }

  deselectTab(deselected: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(deselected);
  }
}
