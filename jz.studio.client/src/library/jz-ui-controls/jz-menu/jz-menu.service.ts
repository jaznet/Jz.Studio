
import { EventEmitter, Injectable, Output } from '@angular/core';
import { JzMenuTabComponent } from './jz-menu-tab/jz-menu-tab.component';
import { MenuItemBaseComponent } from './j3-menu-item-base/j3-menu-item-base.component';

@Injectable({
  providedIn: 'root'
})
export class JzMenuService {
  @Output() menuItemSelectedEvent = new EventEmitter<MenuItemBaseComponent>();
  @Output() menuItemDeselectedEvent = new EventEmitter<MenuItemBaseComponent>();

  constructor() { }

  menuItemSelected(selected: MenuItemBaseComponent) {
    this.menuItemSelectedEvent.emit(selected);
  }

  tabSelected(tab: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(tab);
  }

  deselectTab(deselected: MenuItemBaseComponent) {
    this.menuItemSelectedEvent.emit(deselected);
  }
}
