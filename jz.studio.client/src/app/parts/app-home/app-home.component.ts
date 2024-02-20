import { Component, HostBinding } from '@angular/core';
import { AppServices } from '../../app-services/app-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent view-router-container';
  constructor(private appService:AppServices) {
    console.log('AppHomeComponent');
    //appService.toggleHeaderEvent.emit('show');
    //appService.toggleMenuEvent.emit('show');
  }
}
