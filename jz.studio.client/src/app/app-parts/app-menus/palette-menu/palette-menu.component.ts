

import { Component, HostBinding } from '@angular/core';
import { AppMgrService } from '../../../app-services/app-mgr.service';
import { PaletteMgrService } from '../../../app-services/palette-mgr.service';
import { AppEventsService } from '../../../app-services/app-events.service';
import { JzRadioButtonComponent } from './jz-radio-button/jz-radio-button.component';


@Component({
  selector: 'palette-menu',
  standalone: true,
    imports: [JzRadioButtonComponent],
    templateUrl: './palette-menu.component.html',
    styleUrls: ['./palette-menu.component.css']
})
export class PaletteMenuComponent {
  @HostBinding('class') classes = 'fit-to-content';

  paletteName: string = 'palette';

  constructor(
    private events: AppEventsService,
    private paletteMgr:PaletteMgrService
  ) {
    this.events.paletteChangedEvent.subscribe(palette => {
      this.paletteName = palette;
    })
  }

  ngOnInit(): void { }

  setPalette(palette: string) {
     this.paletteName = palette;
    this.paletteMgr.ChangePalette(palette);
  }
}
