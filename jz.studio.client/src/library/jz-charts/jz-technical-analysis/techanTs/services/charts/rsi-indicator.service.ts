import { Injectable } from '@angular/core';
import { line } from 'd3-shape';
import { select } from 'd3-selection';
import { ChartDataService } from '../chart-data.service';
import { ChartLayoutService } from '../chart-layout.service';
import { ChartScalesService } from '../chart-scales.service';

@Injectable({
  providedIn: 'root',
})
export class RsiIndicatorService {
  private _xScale: any;
  private _yScale: any;
  private gRsi: any;
  private rollingPeriod: number = 14; // Default RSI period

  constructor(
    private scales: ChartScalesService,
    private data: ChartDataService,
    private layout: ChartLayoutService
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
    this.gRsi = select(gTargetRef).attr('class', 'rsi-chart');
    return this;
  }

  public setRollingPeriod(period: number): this {
    this.rollingPeriod = period;
    return this;
  }

  private calculateRsi(data: { date: Date; close: number }[]): { date: Date; rsi: number }[] {
    if (!data || data.length < this.rollingPeriod) return [];

    const rsiValues: { date: Date; rsi: number }[] = [];
    let gainSum = 0;
    let lossSum = 0;

    // Initialize gain and loss sums for the first rolling period
    for (let i = 1; i < this.rollingPeriod; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gainSum += change;
      } else {
        lossSum -= change; // Loss is a negative value
      }
    }

    // Calculate RSI for the rest of the data
    for (let i = this.rollingPeriod; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gainSum = (gainSum * (this.rollingPeriod - 1) + change) / this.rollingPeriod;
        lossSum = (lossSum * (this.rollingPeriod - 1)) / this.rollingPeriod;
      } else {
        gainSum = (gainSum * (this.rollingPeriod - 1)) / this.rollingPeriod;
        lossSum = (lossSum * (this.rollingPeriod - 1) - change) / this.rollingPeriod;
      }

      const rs = gainSum / lossSum;
      const rsi = 100 - 100 / (1 + rs);

      rsiValues.push({ date: data[i].date, rsi });
    }

    return rsiValues;
  }

  public draw(): void {
    // Calculate RSI data
    const rsiData = this.calculateRsi(this.data.parsedData);

    // Define the RSI line generator
    const rsiLine = line<{ date: Date; rsi: number }>()
      .x((d) => this._xScale(d.date))
      .y((d) => this._yScale(d.rsi));

    // Append or update the RSI path
    const rsiPath = this.gRsi.selectAll('.rsi-line').data([rsiData]);

    rsiPath
      .enter()
      .append('path')
      .attr('class', 'rsi-line')
      .merge(rsiPath)
      .attr('d', rsiLine)
      .attr('stroke', 'purple')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    rsiPath.exit().remove();
  }
}
