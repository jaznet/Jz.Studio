import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './app-welcome.component.html',
  styleUrls: ['./app-welcome.component.css']
})
export class AppWelcomeComponent {
  @HostBinding('class') classes = 'fit-to-parent centered';
  currentDate;

  constructor() {
    this.currentDate = new Date().toLocaleDateString();
  }
}
