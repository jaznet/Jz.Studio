
import { Injectable } from '@angular/core';
import { ChartDataService } from '../chart-data.service';
import { select } from 'd3-selection';
import { ChartLayoutService } from '../chart-layout.service';
import { ChartScalesService } from '../chart-scales.service';
import { CandlestickData } from '../../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root',
})
export class CandlestickChartService {
  private _xScale: any;
  private _yScale: any;
  private _candleWidth: number = 0;
  gCandlestick: any;

  constructor(
    private scales: ChartScalesService,
    private data: ChartDataService,
    private layout: ChartLayoutService
  ) { }

  public xScale(scale: any) {
    this._xScale = scale;
    return this; // Allows method chaining
  }

  public yScale(scale: any) {
    this._yScale = scale;
    return this; // Allows method chaining
  }

  public setTargetGroup(gTargetRef: any) {
    this.gCandlestick = select(gTargetRef)
      .attr("class", "candlestick");
    return this;
  }

  public setCandleWidth() {
    // Calculate the width of each candlestick
    const dataTimeIntervals = this.data.parsedData.map((d: any, i: number) => {
      if (i === 0) return 0; // No interval for the first data point
      return this.data.parsedData[i].date.getTime() - this.data.parsedData[i - 1].date.getTime();
    }).filter((interval: number) => interval > 0); // Remove the first zero interval

    const averageTimeInterval = dataTimeIntervals.reduce((a: any, b: any) => a + b, 0) / dataTimeIntervals.length;
    const timeDiff = this.data.parsedData.length > 1
      ? this.data.parsedData[1].date.getTime() - this.data.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds
     this._candleWidth =
      this.scales.candlestickXscale(new Date(this.data.parsedData[0].date.getTime() + timeDiff)) - this.scales.candlestickXscale(this.data.parsedData[0].date);
  
    return this; // Allows method chaining
  }

  /*  public draw(selection: any): void {*/
  public draw(): void {
    const parsedData = this.data.parsedData;

    const wicks = this.gCandlestick.selectAll('.wick').data(parsedData);

    wicks.enter()
      .append('line')
      .attr('class', 'wick')
      .merge(wicks)
      .attr('x1', (d: CandlestickData) => this._xScale(d.date)! + this._candleWidth / 2)
      .attr('x2', (d: CandlestickData) => this._xScale(d.date)! + this._candleWidth / 2)
      .attr('y1', (d: CandlestickData) => this._yScale(d.high))
      .attr('y2', (d: CandlestickData) => this._yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    wicks.exit().remove();

    const candle = this.gCandlestick.selectAll('.candle').data(parsedData);

    candle.enter()
      .append('rect')
      .attr('class', 'candle')
      .merge(candle)
      .attr('x', (d: CandlestickData) => this._xScale(d.date) ?? 0)
      .attr('y', (d: CandlestickData) => this._yScale(Math.max(d.open, d.close)))
      .attr('width', this._candleWidth)
      .attr('height', (d: CandlestickData) => Math.abs(this._yScale(d.open) - this._yScale(d.close)))
      .attr('fill', (d: CandlestickData) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    candle.exit().remove();
  }
}
