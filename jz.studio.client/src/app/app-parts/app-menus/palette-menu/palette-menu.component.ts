import { Component, HostBinding } from '@angular/core';
import { AppMgrService } from '../../../app-services/app-mgr.service';
import { PaletteMgrService } from '../../../app-services/palette-mgr.service';

@Component({
  selector: 'palette-menu',
  templateUrl: './palette-menu.component.html',
  styleUrls: [ './palette-menu.component.css']
})
export class PaletteMenuComponent {
  @HostBinding('class') classes = 'fit-to-content';

  paletteName: string = '';

  constructor(
    private appMgr: AppMgrService,
    private paletteMgr:PaletteMgrService
  ) {
    this.appMgr.paletteChnagedEvent.subscribe(palette => {
      this.paletteName = palette;
    })
  }

  ngOnInit(): void { }

  setPalette(palette: string) {
    this.paletteName = palette;
    this.paletteMgr.ChangePalette(palette);
  }
}
