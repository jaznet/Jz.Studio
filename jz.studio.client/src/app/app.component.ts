import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaletteMgrService } from './parts/app-services/palette-mgr.service';

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

  constructor(private http: HttpClient, private palette: PaletteMgrService) {
    palette.InitializePalette();
  }

  ngOnInit() {
   //this.getForecasts();
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
