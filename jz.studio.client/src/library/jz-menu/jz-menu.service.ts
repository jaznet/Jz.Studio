
import { EventEmitter, Injectable, Output } from '@angular/core';
import { JzMenuTabComponent } from './jz-menu-tab/jz-menu-tab.component';
import { PaletteMgrService } from '../../app/app-services/palette-mgr.service';
@Injectable({

  providedIn: 'root'
})
export class JzMenuService {
  @Output() menuItemSelectedEvent = new EventEmitter<JzMenuTabComponent>();
  @Output() menuItemDeselectedEvent = new EventEmitter<JzMenuTabComponent>();

  constructor(private paletteMgr: PaletteMgrService) { }
   
  menuItemSelected(selected: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(selected);
  }

  tabSelected(tab: JzMenuTabComponent) {
    console.log(tab);
    this.menuItemSelectedEvent.emit(tab);
    this.paletteMgr.ChangePalette(tab.palette);
  }

  deselectTab(deselected: JzMenuTabComponent) {
    this.menuItemSelectedEvent.emit(deselected);
  }
}
