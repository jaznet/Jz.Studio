import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaletteMgrService } from './app-services/palette-mgr.service';
import { NavigationStart, Router } from '@angular/router';
import { NavigationListenerService } from './app-services/navigation-listener.service';

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
  public forecasts: WeatherForecast[] = [];

  constructor(
    private router: Router,
    private navigationListenerService: NavigationListenerService,
    private http: HttpClient,
    private palette: PaletteMgrService) {
    palette.InitializePalette();
  }

  ngOnInit() {
   
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
