
import { Injectable } from '@angular/core';
import { ChartDataService } from '../chart-data.service';
import { select } from 'd3-selection';
import { LayoutService } from '../layout.service';
import { ScalesService } from '../scales.service';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { axisLeft, axisRight } from 'd3-axis';

@Injectable({
  providedIn: 'root',
})
export class OhlcChartService {

  ohlc_yAxisL: any;
  ohlc_yAxisL_grp: any;
  ohlc_yAxisL_rct: any;

  ohlc_yAxisR: any;
  ohlc_yAxisR_grp: any;
  ohlc_yAxisR_rct: any;

  //yAxisRightA: any;
  chartYaxisLeft: any;
  chartYaxisRight: any;

  private _xScale: any;
  private _yScale: any;
  private _candleWidth: number = 0;
  gCandlestick: any;

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
    private layout: LayoutService
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
    const uniqueDates = this.data.parsedData.map(d => d.date.toISOString());

    // Use bandWidth() for `scaleBand()` instead of manual calculations
    this._candleWidth = this.scales.dateScaleX.bandwidth();

    return this; // Allows method chaining
  }

  public drawAxes() {
    this.ohlc_yAxisL = select(this.layout.ohlc_yAxisL);
    this.ohlc_yAxisR = select(this.layout.ohlc_yAxisR);

    this.chartYaxisLeft = axisLeft(this.scales.ohlcYscale);
    this.chartYaxisRight = axisRight(this.scales.ohlcYscale);

    this.ohlc_yAxisL.call(this.chartYaxisLeft);
    this.ohlc_yAxisR.call(this.chartYaxisRight);

    return this;
  }

  public draw(): void {
    const parsedData = this.data.parsedData;

    const wicks = this.gCandlestick.selectAll('.wick').data(parsedData);

    wicks.enter()
      .append('line')
      .attr('class', 'wick')
      .merge(wicks)
      .attr('x1', (d: ohlcData) => (this._xScale(d.date.toISOString()) ?? 0) + this._candleWidth / 2)
      .attr('x2', (d: ohlcData) => (this._xScale(d.date.toISOString()) ?? 0) + this._candleWidth / 2)
      .attr('y1', (d: ohlcData) => this._yScale(d.high))
      .attr('y2', (d: ohlcData) => this._yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    wicks.exit().remove();


    const candle = this.gCandlestick.selectAll('.candle').data(parsedData);

    candle.enter()
      .append('rect')
      .attr('class', 'candle')
      .merge(candle)
      /*.attr('x', (d: olhcData) => this._xScale(d.date) ?? 0)*/
      .attr('x', (d: ohlcData) => {
     //   console.log("Date:", d.date, "Scaled X:", this._xScale(d.date.toISOString()));
        return this._xScale(d.date.toISOString()) ?? 0;
      })
      .attr('y', (d: ohlcData) => this._yScale(Math.max(d.open, d.close)))
      .attr('width', this._candleWidth)
      .attr('height', (d: ohlcData) => Math.abs(this._yScale(d.open) - this._yScale(d.close)))
      .attr('fill', (d: ohlcData) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    candle.exit().remove();
  }
}

