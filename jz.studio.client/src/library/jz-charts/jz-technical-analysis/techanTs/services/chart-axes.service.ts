import { ElementRef, Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll } from 'd3-selection';
import { ChartLayoutService } from './chart-layout.service';
import { Selection } from 'd3-v4';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  candlestickXaxisTop: any;
  candlestickXaxisBottom: any;
  candlestickYaxisLeft: any;
  candlestickYaxisRight: any;

  xAxisTop!: any;
  yAxisRight: any;
  xAxisBottom: any;
  yAxisLeft: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {

    this.xAxisTop = select(this.layout.xAxisTop);
    this.yAxisRight = select(this.layout.yAxisRightA);
    this.xAxisBottom = select(this.layout.xAxisBottomGroup);
    this.yAxisLeft = select(this.layout.yAxisLeftA);

    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'

    // CANDLESTICK
    this.candlestickXaxisTop = axisTop(this.scales.dateScaleX)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));
    this.candlestickYaxisRight = axisRight(this.scales.ohlcYscale);
    this.candlestickXaxisBottom = axisBottom(this.scales.dateScaleX)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));
    this.candlestickYaxisLeft = axisLeft(this.scales.ohlcYscale);

    this.xAxisTop.call(this.candlestickXaxisTop);
    this.xAxisBottom.call(this.candlestickXaxisBottom);
    this.yAxisLeft.call(this.candlestickYaxisLeft);
    this.yAxisRight.call(this.candlestickYaxisRight);
  


  }
}
