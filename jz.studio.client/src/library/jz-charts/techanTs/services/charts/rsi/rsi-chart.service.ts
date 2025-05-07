import { Injectable } from '@angular/core';
import { line } from 'd3-shape';
import { Selection, select } from 'd3-selection';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale'
import { ScalesService } from '../../scales.service';
import { ChartDataService } from '../../chart-data.service';
import { scaffold } from '../../../interfaces/techan-interfaces';
import { RsiChartLayoutService } from './rsi-chart-layout.service';

@Injectable({
  providedIn: 'root',
})
export class RsiChart {
 
  rsiYscale: any;





  chartYaxisLeft: any;
  chartYaxisRight: any;

  private _xScale: any;
/*  private _yScale: any;*/
  private gRsi: any;
  private rollingPeriod: number = 14; // Default RSI period

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
    private rsiLayout: RsiChartLayoutService
  ) { }

  public xScale(scale: any): this {
    this._xScale = scale;
    return this;
  }

  public yScale(scale: any): this {
   /* this._yScale = scale;*/
    return this;
  }

  public setTargetGroup(gTargetRef: any): this {
    this.gRsi = gTargetRef.attr('class', 'rsi-chart');
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

  public drawAxes(scaffold: scaffold) {
    this.rsiYscale = scaleLinear().domain([0, 100]).range([scaffold.sections[3].height, 0]);

    this.chartYaxisLeft = axisLeft(this.rsiYscale);
    this.chartYaxisRight = axisRight(this.rsiYscale);

    this.rsiLayout.gAxisLeft.call(this.chartYaxisLeft);
    this.rsiLayout.gAxisRight.call(this.chartYaxisRight);

    return this;
  }

  public draw(): void {
    // Calculate RSI data
    const rsiData = this.calculateRsi(this.data.parsedData);

    // Define the RSI line generator
    const rsiLine = line<{ date: Date; rsi: number }>()
      .x((d) => this._xScale(d.date.toISOString())! + this._xScale.bandwidth() / 2) // Fix x mapping
      .y((d) => isNaN(this.rsiYscale(d.rsi)) ? this.rsiYscale(50) : this.rsiYscale(d.rsi)); // Fix y mapping

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

    // Draw overbought, oversold, and middle lines
    this.drawThresholdLine(70, 'overbought', 'dotted');
    this.drawThresholdLine(30, 'oversold', 'dotted');
    this.drawThresholdLine(50, 'middle', 'solid');
  }

  private drawThresholdLine(level: number, className: string, strokeDasharray: string): void {
    const thresholdLine = this.gRsi.selectAll(`.${className}-line`).data([level]);

    thresholdLine
      .enter()
      .append('line')
      .attr('class', `${className}-line`)
      .merge(thresholdLine)
      .attr('x1', this._xScale.range()[0]) // Start of the x-axis
      .attr('x2', this._xScale.range()[1]) // End of the x-axis
      .attr('y1', this.rsiYscale(level))
      .attr('y2', this.rsiYscale(level))
      .attr('stroke', className === 'middle' ? 'gray' : 'red') // Different color for middle line
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', strokeDasharray === 'dotted' ? '4, 2' : 'none') // Dotted or solid
      .attr('fill', 'none');

    thresholdLine.exit().remove();
  }
}
