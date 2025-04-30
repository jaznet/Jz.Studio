import { Injectable } from '@angular/core';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { ChartDataService } from '../chart-data.service';
import { LayoutService } from '../layout.service';
import { ScalesService } from '../scales.service';
import { ChartOhlcService } from './chart-ohlc.service';

@Injectable({
  providedIn: 'root',
})
export class SmaChartService {
  private _xScale: any;
  private smaYscale: any;
  private gSma: any;
  private rollingPeriod: number = 10; // Default SMA window size
  private color = 'white';

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
    private layout: LayoutService,
    private ohlc: ChartOhlcService
  ) { }

  public xScale(scale: any): this {
    this._xScale = scale;
    return this; // Enables method chaining
  }

  //public yScale(scale: any): this {
  //  this._yScale = scale;
  //  return this; // Enables method chaining
  //}

  public setTargetGroup(gTargetRef: any): this {
    this.gSma = select(gTargetRef).attr('class', 'sma-chart');
    return this;
  }

  public setColor(color: any):this {
    this.color = color;
    return this;
  }

  public setRollingPeriod(size: number): this {
    this.rollingPeriod = size;
    return this;
  }

  private calculateSma(data: { date: Date; close: number }[]): { date: Date; value: number }[] {
    if (!data || data.length < this.rollingPeriod) return [];

    const smaValues: { date: Date; value: number }[] = [];
    for (let i = 0; i <= data.length - this.rollingPeriod; i++) {
      const windowData = data.slice(i, i + this.rollingPeriod);
      const average = windowData.reduce((sum, point) => sum + point.close, 0) / this.rollingPeriod;
      smaValues.push({
        date: windowData[this.rollingPeriod - 1].date, // The last date in the current window
        value: average,
      });
    }
    return smaValues;
  }

  public draw(): void {
    // Calculate the SMA data
    const smaData = this.calculateSma(this.data.parsedData);

    // Define the line generator
    const smaLine = line<{ date: Date; value: number }>()
      .x((d) => this._xScale(d.date.toISOString()) + this._xScale.bandwidth() / 2) // Convert Date to string
      .y((d) => this.ohlc.ohlcYscale(d.value));

    // Append or update the SMA path
    const smaPath = this.gSma.selectAll('.sma-line').data([smaData]);

    smaPath
      .enter()
      .append('path')
      .attr('class', 'sma-line')
      .merge(smaPath)
      .attr('d', smaLine)
      .attr('stroke',this.color)
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    smaPath.exit().remove();
  }
}
