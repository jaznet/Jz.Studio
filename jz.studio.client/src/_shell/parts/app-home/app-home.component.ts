import { Component, HostBinding } from '@angular/core';
import { AppStateService } from '../../services/shell-state.service';
import { JzStudioLogoComponent } from '../../../_framework/branding/jz-studio-logo/jz-studio-logo.component';

@Component({
    selector: 'app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.css'],
  standalone: true,
  imports: [JzStudioLogoComponent]
})
export class AppHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent view-router-container';

  constructor(private appService: AppStateService) {
    console.log('AppHomeComponent');
    {
     // palette.changePalette('onyx');
    }
    appService.showHeader();
    appService.showMenu();
    console.log('show');
  }
}
