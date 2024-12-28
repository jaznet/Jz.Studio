import { Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  candlestickXaxis: any;
  candlestickYaxis: any;

  constructor(private scales: ChartScalesService) { }

  setAxes(): void {
   /* this.candlestickYaxis = axisLeft(this.scales.candlestickYscale);*/
  }
}
