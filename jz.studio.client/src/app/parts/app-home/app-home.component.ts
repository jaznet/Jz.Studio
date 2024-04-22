import { Component, HostBinding } from '@angular/core';
import { AppStateService } from '../../app-services/app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent view-router-container';
  constructor(private appService: AppStateService) {
    console.log('AppHomeComponent');
    appService.showHeader();
    appService.showMenu();
    console.log('show');
  }
}
