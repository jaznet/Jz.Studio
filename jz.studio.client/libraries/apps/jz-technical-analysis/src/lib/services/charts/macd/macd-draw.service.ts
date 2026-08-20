import { AfterViewInit, Injectable } from '@angular/core';
import { Selection, select } from 'd3-selection';
import { line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { ChartType } from '../../../enums/chart-type';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';
import { ChartScaffold } from '../../../interfaces/chart-scaffold.interface';


@Injectable({
  providedIn: 'root',
})
export class MacdDrawService extends BaseChartLayoutService implements AfterViewInit {

  protected chartType: ChartType = ChartType.MACD;

  macdYscale: any;
  //axisLeft: any;
  //axisRight: any;

  private _xScale!: { (arg0: string): number; (arg0: string): number; bandwidth: any; };
  private gMacd!: Selection<SVGGElement, unknown, null, undefined>;
  private fastPeriod: number = 12; // Default fast EMA period
  private slowPeriod: number = 26; // Default slow EMA period
  private signalPeriod: number = 9; // Default signal line period

  //constructor(
  // // private macd: MacdChartLayoutService
  //) {super() }

  override  ngAfterViewInit(): void {  }

  protected setSize(width: number, height: number): void {
    // You can store or apply width/height here
    console.log('📏 MacdDrawService.setSize()', width, height);

    // Optional: update SVG elements or internal state
//    this.rSection.attr('width', width);
//    this.rSection.attr('height', height);
    this.rContent.attr('width', width);
    this.rContent.attr('height', height);
  }

  public xScale(scale: any): this {
    this._xScale = scale;
    return this;
  }

  public setTargetGroup(gTargetRef: SVGGElement): this {
  
    this.gMacd = select(gTargetRef); // ✅ now it's a D3 selection
    console.log('gMacd selection:', this.gMacd);
    this.gMacd
      .append('circle')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 10)
      .attr('fill', 'orange');

    return this;
  }

  public setPeriods(fast: number, slow: number, signal: number): this {
    this.fastPeriod = fast;
    this.slowPeriod = slow;
    this.signalPeriod = signal;
    return this;
  }

  private calculateEma(data: { close: number }[], period: number): number[] {
    const multiplier = 2 / (period + 1);
    const ema: number[] = [];
    let prevEma: number | null = null;

    data.forEach((d, i) => {
      if (i < period - 1) {
        ema.push(0); // No EMA for the first (period - 1) points
      } else if (i === period - 1) {
        const sum = data.slice(0, period).reduce((a, b) => a + b.close, 0);
        const initialEma = sum / period;
        ema.push(initialEma);
        prevEma = initialEma;
      } else {
        const currentEma = (d.close - prevEma!) * multiplier + prevEma!;
        ema.push(currentEma);
        prevEma = currentEma;
      }
    });

    return ema;
  }

  private calculateMacd(data: { date: Date; close: number }[]): any[] {
    const slowEma = this.calculateEma(data, this.slowPeriod);
    const fastEma = this.calculateEma(data, this.fastPeriod);
    const macd = fastEma.map((val, i) => val - slowEma[i]);
    const signal = this.calculateEma(macd.map((value, i) => ({ close: value })), this.signalPeriod);
    const divergence = macd.map((value, i) => value - signal[i]);

    return data.map((d, i) => ({
      date: d.date,
      macd: macd[i],
      signal: signal[i],
      divergence: divergence[i],
    }));
  }

  public draw() { }

  public drawAxes(chartScaffold: ChartScaffold) {
    // Calculate the min and max values from MACD data
    const allValues = this.data.flatMap((d: { macd: any; signal: any; histogram: any; }) => {
      return [d.macd, d.signal, d.histogram];
    });
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    // Create the y-scale
    this.macdYscale = scaleLinear()
      .domain([min, max]) // Domain based on MACD values
      .range([0]); // Range based on the chart height

    //this.axisLeft.gAxis.call(axisLeft(this.macdYscale));
    //this.axisRight.gAxis.call(axisRight(this.macdYscale));


    return this;
  }

  //public draw(): void {
  //  this.gMacd
  //    .append('circle')
  //    .attr('cx', 50)
  //    .attr('cy', 50)
  //    .attr('r', 10)
  //    .attr('fill', 'red');

     lineGenerator = line<{ date: Date; macd: number }>()
      .x(d => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2)
      .y(d => this.macdYscale(d.macd));

     signalLineGenerator = line<{ date: Date; signal: number }>()
      .x(d => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2)
      .y(d => this.macdYscale(d.signal));

//    console.log('MACD data in draw():', this.data);

  // bars: Selection<SVGRectElement, any, SVGElement, unknown> = this.gMacd.selectAll<SVGRectElement, any>('.histogram-bar').data(this.data);
    //bars
    //  .enter()
    //  .append('rect')
    //  .attr('class', 'histogram-bar')
    //  .merge(bars)
    //  .attr('x', (d: { date: { toISOString: () => any; }; }) => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2 - 2)
    //  .attr('y', (d: { histogram: any; }) => isNaN(this.macdYscale(d.histogram)) ? 0 : this.macdYscale(d.histogram))
    //  .attr('width', 4)
    //  .attr('height', (d: { histogram: any; }) => Math.abs(this.macdYscale(d.histogram) - this.macdYscale(0)))
    //  .attr('fill', (d: { histogram: number; }) => d.histogram > 0 ? 'green' : 'red');
    //bars.exit().remove();

  //   macdLine = this.gMacd.selectAll<SVGPathElement, any>('.macd-line').data([this.data]);
    //macdLine
    //  .enter()
    //  .append('path')
    //  .attr('class', 'macd-line')
    //  .merge(macdLine)
    //  .attr('d', lineGenerator)
    //  .attr('stroke', '#f8f32b')
    //  .attr('stroke-width', 2)
    //  .attr('fill', 'none');
    //macdLine.exit().remove();

 //    signalLine = this.gMacd.selectAll<SVGPathElement, any>('.signal-line').data([this.data]);
    //signalLine
    //  .enter()
    //  .append('path')
    //  .attr('class', 'signal-line')
    //  .merge(signalLine)
    //  .attr('d', signalLineGenerator)
    //  .attr('stroke', 'red')
    //  .attr('stroke-width', 2)
    //  .attr('fill', 'none');
  //signalLine.exit().remove();

  }


