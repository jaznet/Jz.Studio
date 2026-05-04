import { Component, HostBinding } from '@angular/core';
import { AppStateService } from '../../services/shell-state.service';
import { PaletteMgrService } from '../../services/palette-mgr.service';

@Component({
    selector: 'app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.css'],
    standalone: false
})
export class AppHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent view-router-container';

  constructor(private appService: AppStateService, private palette: PaletteMgrService,) {
    console.log('AppHomeComponent');
    {
      palette.changePalette('onyx');
    }
    appService.showHeader();
    appService.showMenu();
    console.log('show');
  }
}
