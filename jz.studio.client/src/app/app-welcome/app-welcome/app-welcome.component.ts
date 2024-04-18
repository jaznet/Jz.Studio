import { Component, HostBinding, OnInit } from '@angular/core';
import { AppStateService } from '../../app-services/app-state.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './app-welcome.component.html',
  styleUrls: ['./app-welcome.component.css']
})
export class AppWelcomeComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent centered';
  currentDate;

  constructor(private appService: AppStateService) {
    this.appService.hideHeader()
    this.currentDate = new Date().toLocaleDateString();
  }

  ngOnInit(): void {
    this.appService.hideHeader();
  }
}
