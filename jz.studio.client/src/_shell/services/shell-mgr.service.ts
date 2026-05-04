import { EventEmitter, Injectable, Output } from '@angular/core';
import { PaletteMgrService } from './palette-mgr.service';
import { ShellEventsService } from './shell-events.service';

@Injectable({
  providedIn: 'root'
})
export class AppMgrService {
  constructor(
    private shellEvents: ShellEventsService,
    private paletteMgr: PaletteMgrService
  ) {
    this.shellEvents.viewSelectedEvent.subscribe((v) => {
      this.OnViewSelected(v);
    });
  }

  //InitializePalette() {
  //  this.paletteMgr.changePalette('feldgrau');
  //}

  OnViewSelected(view: any) {
    switch (view) {
      case 'home':
        this.paletteMgr.changePalette('rifle');
        break;
      case 'visualization':
        this.paletteMgr.changePalette('feldgrau');
        break;
      case 'equities':
        this.paletteMgr.changePalette('feldgrau');
        break;
      case 'chorodash':
        this.paletteMgr.changePalette('feldgrau');
        break;
      case 'gears':
        this.paletteMgr.changePalette('xyno');
        break;
    }
  }


}
