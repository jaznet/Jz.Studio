

import { Component, HostBinding } from '@angular/core';
import { AppMgrService } from '../../../services/shell-mgr.service';
import { PaletteMgrService } from '../../../services/palette-mgr.service';
import { ShellEventsService } from '../../../services/shell-events.service';
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
    private events: ShellEventsService,
    private paletteMgr:PaletteMgrService
  ) {
    this.events.paletteChangedEvent.subscribe(palette => {
      this.paletteName = palette;
    })
  }

  ngOnInit(): void { }

  setPalette(palette: string) {
     this.paletteName = palette;
    this.paletteMgr.changePalette(palette);
  }
}
