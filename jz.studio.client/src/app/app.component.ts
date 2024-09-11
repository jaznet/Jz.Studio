import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaletteMgrService } from './app-services/palette-mgr.service';
import { NavigationStart, Router } from '@angular/router';
import { NavigationListenerService } from './app-services/navigation-listener.service';
import { PopOverLoadingComponent } from '../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopOversService } from '../library/jz-pop-overs/jz-pop-overs.service';
import { AppHeaderComponent } from './app-parts/app-header/app-header.component';
import { AppContentComponent } from './app-parts/app-content/app-content.component';
import { AppFooterComponent } from './app-parts/app-footer/app-footer.component';
import { AppStateService } from './app-services/app-state.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('header', { static: true }) header!: AppHeaderComponent;
  @ViewChild('content', { static: true }) content!: AppContentComponent;
  @ViewChild('footer', { static: true }) footer!: AppFooterComponent;
  @ViewChild('popOverLoadingComponent', { static: true }) popover!: PopOverLoadingComponent;
  public forecasts: WeatherForecast[] = [];

  constructor(
    private router: Router,
    private appService: AppStateService,
    private navigationListenerService: NavigationListenerService,
    private popoversService:JzPopOversService,
    private http: HttpClient,
    private palette: PaletteMgrService)
  {
    palette.InitializePalette();
  }

  ngOnInit() {
    console.log(this.header);
    console.log(this.content);
    console.log(this.footer);

    window.addEventListener("load", function () {
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        console.log("The page was reloaded.");
      } else {
        console.log("The page was loaded for the first time.");
      }
    });

    this.appService.toggleHeaderEvent.subscribe((e) => {
      this.header.visibility = e === 'hide' ? 'collapse' : 'visible';
      console.log(e);
    })

    //this.popupsService.popUpEvent.subscribe((event: any) => {
    //  this.popup.isPopupVisible = true;
    //  console.log(this.popup);
    //})

    //this.popupsService.popoverEvent.subscribe((event: any) => {
    //  this.popover.isPopupVisible = true;
    //  console.log(this.popover);
    //})
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'jz.studio.client';
}
