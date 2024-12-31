import { Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll } from 'd3-selection';
import { ChartLayoutService } from './chart-layout.service';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  candlestickXaxis: any;
  candlestickYaxis: any;

  gXaxisGroupTop: any;
  gXaxisGroupBottom: any;
  gYaxisGroupLeft: any;
  gYaxisGroupRight: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {
    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'

    this.candlestickXaxis = axisBottom(this.scales.candlestickXscale)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));

    this.candlestickYaxis = axisLeft(this.scales.candlestickYscale);
    this.gYaxisGroupLeft.call(this.candlestickYaxis);
    this.gXaxisGroupBottom.call(this.candlestickXaxis);
  }
}
