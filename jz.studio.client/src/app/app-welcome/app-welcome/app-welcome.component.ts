import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { AppStateService } from '../../app-services/app-state.service';
import { LogonComponent } from '../../app-parts/app-logon/logon/logon.component';

@Component({
    selector: 'app-welcome',
    imports: [LogonComponent],
    templateUrl: './app-welcome.component.html',
    styleUrls: ['./app-welcome.component.css']
})
export class AppWelcomeComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent centered';
  currentDate;

  constructor(private appService: AppStateService) {
    //this.appService.hideHeader()
    this.currentDate = new Date().toLocaleDateString();
  }
   
  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
    this.appService.hideHeader();
  }
}
