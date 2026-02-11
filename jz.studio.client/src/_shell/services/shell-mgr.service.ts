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
  //  this.paletteMgr.ChangePalette('feldgrau');
  //}

  OnViewSelected(view: any) {
    switch (view) {
      case 'home':
        this.paletteMgr.ChangePalette('rifle');
        break;
      case 'visualization':
        this.paletteMgr.ChangePalette('feldgrau');
        break;
      case 'equities':
        this.paletteMgr.ChangePalette('feldgrau');
        break;
      case 'chorodash':
        this.paletteMgr.ChangePalette('feldgrau');
        break;
      case 'gears':
        this.paletteMgr.ChangePalette('xyno');
        break;
    }
  }


}
