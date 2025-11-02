import { EventEmitter, Injectable, Output } from '@angular/core';
import { AppEventsService } from './app-events.service';
import { PaletteMgrService } from './palette-mgr.service';

@Injectable({
  providedIn: 'root'
})
export class AppMgrService {
  constructor(
    private appEvents: AppEventsService,
    private paletteMgr: PaletteMgrService
  ) {
    this.appEvents.viewSelectedEvent.subscribe((v) => {
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
