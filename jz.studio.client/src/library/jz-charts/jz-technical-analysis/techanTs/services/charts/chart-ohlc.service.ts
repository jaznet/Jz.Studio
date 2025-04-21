
import { ElementRef, Injectable } from '@angular/core';
import { ChartDataService } from '../chart-data.service';
import { Selection, select } from 'd3-selection';
import { ScalesService } from '../scales.service';
import { chart_attributes, ohlcData } from '../../interfaces/techan-interfaces';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

@Injectable({
  providedIn: 'root',
})
export class ChartOhlcService {
  // #region PROPERTIES
  ohlcSection!: SVGGElement;
  ohlcSectionRect!: SVGRectElement;
  ohlcSectionContent!: SVGGElement;
  ohlcSectionContentRect!: SVGRectElement;

  ohlcYscale: any;

  axisLeft: any;
  axisRight: any;

  gOhlcAxisLeft!: Selection<SVGGElement, unknown, null, undefined>;
  ohlc_yAxisL_grp: any;
  ohlcAxisRectLeft: any;

  gOhlcAxisRight: any;
  ohlc_yAxisR_grp: any;
  ohlcAxisRectRight: any;

  //yAxisRightA: any;
  //chartYaxisLeft: any;
  //chartYaxisRight: any;

  private _xScale: any;
  private _yScale: any;
  private _candleWidth: number = 0;
  gCandlestick: any;

  // #endregion PROPERTIES

  constructor(
    private scales: ScalesService,
    private data: ChartDataService
  ) { }

  public xScale(scale: any) {
    this._xScale = scale;
    return this; // Allows method chaining
  }

  //public yScale(scale: any) {
  //  this._yScale = scale;
  //  return this; // Allows method chaining
  //}

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

  public drawAxes(chart_attributes: chart_attributes) {

    this.ohlcYscale = scaleLinear()
      .domain([this.data.minPrice ?? 0, this.data.maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([chart_attributes.sections[0].height, 0]); // Invert the range for correct orientation (top to bottom)

    this.axisLeft = axisLeft(this.ohlcYscale);
    this.axisRight = axisRight(this.ohlcYscale);

    this.gOhlcAxisLeft.call(this.axisLeft);
    this.gOhlcAxisLeft
      .attr('transform', `translate(${chart_attributes.sections[0].margins.left}, 0)`);

    this.gOhlcAxisRight.call(this.axisRight);
    this.gOhlcAxisRight
      .attr('transform', `translate(${chart_attributes.sections[0].margins.left + chart_attributes.sections[0].content.width - chart_attributes.sections[0].margins.right}, 0)`);

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
      .attr('y1', (d: ohlcData) => this.ohlcYscale(d.high))
      .attr('y2', (d: ohlcData) => this.ohlcYscale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    wicks.exit().remove();

    const candle = this.gCandlestick.selectAll('.candle').data(parsedData);

    candle.enter()
      .append('rect')
      .attr('class', 'candle')
      .merge(candle)
      .attr('x', (d: ohlcData) => {
        return this._xScale(d.date.toISOString()) ?? 0;
      })
      .attr('y', (d: ohlcData) => this.ohlcYscale(Math.max(d.open, d.close)))
      .attr('width', this._candleWidth)
      .attr('height', (d: ohlcData) => Math.abs(this.ohlcYscale(d.open) - this.ohlcYscale(d.close)))
      .attr('fill', (d: ohlcData) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    candle.exit().remove();
  }
}

