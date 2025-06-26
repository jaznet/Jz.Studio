
import { AfterViewInit, ElementRef, Injectable } from '@angular/core';
import { Selection, select } from 'd3-selection';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { ScalesService } from '../../scales.service';
import { ChartDataService } from '../../chart-data.service';
import { ohlcData, scaffold } from '../../../interfaces/techan-interfaces';
import { OhlcChartLayoutService } from './ohlc-chart-layout.service';
import { BaseChartComponentDirective } from '../base/base-chart-component.directive';
import { ChartType } from '../../../enums/chart-type';
import { LayoutService } from '../../layout.service';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';

@Injectable({
  providedIn: 'root',
})
export class OhlcChartService extends BaseChartLayoutService implements AfterViewInit {

  protected override chartType!: ChartType;
  protected override setSize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }
  // Optional future customization
  // #region PROPERTIES


  ohlcYscale: any;

  override axisLeft: any;
  override axisRight: any;

  private _xScale: any;
  private _yScale: any;
  private _candleWidth: number = 0;
  gCandlestick: any;

  // #endregion PROPERTIES

  constructor(
    private scales: ScalesService,
    dataService: ChartDataService,
    layoutService: LayoutService,
    private OhlcLayout: OhlcChartLayoutService
  ) { super(layoutService, dataService) }

  override ngAfterViewInit(): void {
 //   this.OhlcLayout.initializeSelections(this.buildRefs());
    }

  public xScale(scale: any) {
    this._xScale = scale;
    return this; // Allows method chaining
  }

  public setTargetGroup(gTargetRef: any) {
    this.gCandlestick = select(gTargetRef)
      .attr("class", "candlestick");
    return this;
  }

  public setCandleWidth() {
    const uniqueDates = this.dataService.parsedData.map(d => d.date.toISOString());

    // Use bandWidth() for `scaleBand()` instead of manual calculations
    this._candleWidth = this.scales.dateScaleX.bandwidth();

    return this; // Allows method chaining
  }

  public drawAxes(scaffold: scaffold) {

    this.ohlcYscale = scaleLinear()
      .domain([this.dataService.minPrice ?? 0, this.dataService.maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([scaffold.sections[ChartType.OHLC]!.height, 0]); // Invert the range for correct orientation (top to bottom)

    this.axisLeft = axisLeft(this.ohlcYscale);
    this.axisRight = axisRight(this.ohlcYscale);

    //this.OhlcLayout.axisLeft.call(this.axisLeft);
    //this.OhlcLayout.axisLeft.gAxis
    //  .attr('transform', `translate(${scaffold.sections[ChartType.OHLC]!.margins.left}, 0)`);

    //this.OhlcLayout.axisRight.call(this.axisRight);
    //this.OhlcLayout.axisRight.gAxis
    //  .attr('transform', `translate(${scaffold.sections[ChartType.OHLC]!.margins.left + scaffold.sections[ChartType.OHLC]!.content.width - scaffold.sections[ChartType.OHLC]!.margins.right}, 0)`);

    return this;
  }

  public draw(): void {
    const parsedData = this.dataService.parsedData;

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

