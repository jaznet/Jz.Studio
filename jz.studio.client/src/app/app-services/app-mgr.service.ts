import { EventEmitter, Injectable, Output } from '@angular/core';
import { AppEventsService } from './app-events.service';
import { PaletteMgrService } from './palette-mgr.service';

@Injectable({
  providedIn: 'root'
})
export class AppMgrService {

  @Output() paletteChangedEvent = new EventEmitter();

  constructor(
    private appEvents: AppEventsService,
    private paletteMgr: PaletteMgrService
  ) {
    this.appEvents.viewSelectedEvent.subscribe((v) => {
      this.OnViewSelected(v);
    });
  }

  InitializePalette() {
    this.paletteMgr.ChangePalette('onyx');
  }

  OnViewSelected(view: any) {
    switch (view) {
      case 'home':
        this.paletteMgr.ChangePalette('rifle');
        break;
      case 'visualization':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'equities':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'chorodash':
        this.paletteMgr.ChangePalette('onyx');
        break;
      case 'gears':
        this.paletteMgr.ChangePalette('xyno');
        break;
    }
  }


}
