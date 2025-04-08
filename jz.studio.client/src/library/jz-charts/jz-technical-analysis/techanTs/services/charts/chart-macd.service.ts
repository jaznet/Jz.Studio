import { Injectable } from '@angular/core';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { ScalesService } from '../scales.service';
import { ChartDataService } from '../chart-data.service';
import { LayoutService } from '../layout.service';
import { axisLeft, axisRight } from 'd3-axis';

@Injectable({
  providedIn: 'root',
})
export class ChartMacdService {
  macdAxisLeft: any;
  macd_yAxisL_grp: any;
  macdAxisRectLeft: any;

  macdAxisRight: any;
  macd_yAxisR_grp: any;
  macdAxisRectRight: any;

  chartYaxisLeft: any;
  chartYaxisRight: any;

  private _xScale: any;
  private _yScale: any;
  private gMacd: any;
  private fastPeriod: number = 12; // Default fast EMA period
  private slowPeriod: number = 26; // Default slow EMA period
  private signalPeriod: number = 9; // Default signal line period

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
    private layout:LayoutService
  ) { }

  public xScale(scale: any): this {
    this._xScale = scale;
    return this;
  }

  public yScale(scale: any): this {
    this._yScale = scale;
    return this;
  }

  public setTargetGroup(gTargetRef: any): this {
    this.gMacd = select(gTargetRef).attr('class', 'macd-chart');
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

  public drawAxes() {
    this.macdAxisLeft = select(this.layout.macdAxisLeft);
    this.macdAxisRight = select(this.layout.macdAxisRight);

    this.chartYaxisLeft = axisLeft(this.scales.macdYscale);
    this.chartYaxisRight = axisRight(this.scales.macdYscale);

    this.macdAxisLeft.call(this.chartYaxisLeft);
    this.macdAxisRight.call(this.chartYaxisRight);

    return this;
  }

  public draw(): void {
 //   this.data.macdData = this.calculateMacd(this.data.parsedData);

    // Line generator for MACD and Signal lines
    const lineGenerator = line<{ date: Date; macd: number }>()
      .x((d) => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2) // Fix here
      .y((d) => this._yScale(d.macd));

    const signalLineGenerator = line<{ date: Date; signal: number }>()
      .x((d) => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2) // Fix here
      .y((d) => this._yScale(d.signal));

    // Draw Divergence as bars
    const bars = this.gMacd.selectAll('.histogram-bar').data(this.data.macdData);

    bars
      .enter()
      .append('rect')
      .attr('class', 'histogram-bar')
      .merge(bars)
      .attr('x', (d: { date: { toISOString: () => any; }; }) => this._xScale(d.date.toISOString())! + this._xScale.bandwidth() / 2 - 2)
      .attr('y', (d: { histogram: any; }) => isNaN(this._yScale(d.histogram)) ? 0 : this._yScale(d.histogram))
      .attr('width', 4) // Width of each bar
      .attr('height', (d: { histogram: any }) => Math.abs(this._yScale(d.histogram) - this._yScale(0)))
      .attr('fill', (d: { histogram: number }) => (d.histogram > 0 ? 'green' : 'red')); // Color based on positive or negative histogram value

    bars.exit().remove();

    // Draw MACD line
    const macdLine = this.gMacd.selectAll('.macd-line').data([this.data.macdData]);
    macdLine
      .enter()
      .append('path')
      .attr('class', 'macd-line')
      .merge(macdLine)
      .attr('d', lineGenerator)
      .attr('stroke', '#f8f32b')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    macdLine.exit().remove();

    // Draw Signal line
    const signalLine = this.gMacd.selectAll('.signal-line').data([this.data.macdData]);
    signalLine
      .enter()
      .append('path')
      .attr('class', 'signal-line')
      .merge(signalLine)
      .attr('d', signalLineGenerator)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    signalLine.exit().remove();
  }
}
