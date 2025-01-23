import { Injectable } from '@angular/core';
import { select, line } from 'd3-selection';
import { ChartScalesService } from '../chart-scales.service';
import { ChartDataService } from '../chart-data.service';

@Injectable({
  providedIn: 'root',
})
export class MacdChartService {
  private _xScale: any;
  private _yScale: any;
  private gMacd: any;
  private fastPeriod: number = 12; // Default fast EMA period
  private slowPeriod: number = 26; // Default slow EMA period
  private signalPeriod: number = 9; // Default signal line period

  constructor(
    private scales: ChartScalesService,
    private data: ChartDataService
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

  public draw(): void {
    const macdData = this.calculateMacd(this.data.parsedData);

    // Line generator for MACD and Signal lines
    const lineGenerator = line<{ date: Date; macd: number }>()
      .x((d) => this._xScale(d.date))
      .y((d) => this._yScale(d.macd));

    const signalLineGenerator = line<{ date: Date; signal: number }>()
      .x((d) => this._xScale(d.date))
      .y((d) => this._yScale(d.signal));

    // Draw MACD line
    const macdLine = this.gMacd.selectAll('.macd-line').data([macdData]);
    macdLine
      .enter()
      .append('path')
      .attr('class', 'macd-line')
      .merge(macdLine)
      .attr('d', lineGenerator)
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    macdLine.exit().remove();

    // Draw Signal line
    const signalLine = this.gMacd.selectAll('.signal-line').data([macdData]);
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

    // Draw Divergence as bars
    const bars = this.gMacd.selectAll('.divergence-bar').data(macdData);
    bars
      .enter()
      .append('rect')
      .attr('class', 'divergence-bar')
      .merge(bars)
      .attr('x', (d) => this._xScale(d.date) - 2) // Adjust width for bar spacing
      .attr('y', (d) => Math.min(this._yScale(0), this._yScale(d.divergence)))
      .attr('width', 4)
      .attr('height', (d) => Math.abs(this._yScale(d.divergence) - this._yScale(0)))
      .attr('fill', (d) => (d.divergence > 0 ? 'green' : 'red'));

    bars.exit().remove();
  }
}
