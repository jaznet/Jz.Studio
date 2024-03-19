import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaletteMgrService } from './app-services/palette-mgr.service';
import { NavigationStart, Router } from '@angular/router';
import { NavigationListenerService } from './app-services/navigation-listener.service';
import { JzPopupsService } from '../library/jz-popups/jz-popups.service';
import { PopUpLoadingComponent } from '../library/jz-popups/pop-up-loading/pop-up-loading.component';

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
  @ViewChild('popUpLoadingComponent', { static: true }) popup!: PopUpLoadingComponent;
  public forecasts: WeatherForecast[] = [];

  constructor(
    private router: Router,
    private navigationListenerService: NavigationListenerService,
    private popupsService:JzPopupsService,
    private http: HttpClient,
    private palette: PaletteMgrService) {
    palette.InitializePalette();
  }

  ngOnInit() {
    this.popupsService.popEvent.subscribe((event: any) => {
      this.popup.isPopupVisible = true;
      console.log(this.popup);
    })
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
