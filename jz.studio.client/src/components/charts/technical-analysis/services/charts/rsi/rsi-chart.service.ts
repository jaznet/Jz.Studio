import { Injectable } from '@angular/core';
import { line } from 'd3-shape';
import { Selection, select } from 'd3-selection';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, ScaleBand, ScaleLinear } from 'd3-scale';

import { ChartDataService } from '../../chart-data.service';
import { RsiChartLayoutService } from './rsi-chart-layout.service';
import { ChartType } from '../../../enums/chart-type';
import { Scaffold } from '../../../interfaces/scaffold.interface';

@Injectable({
  providedIn: 'root',
})
export class RsiChart {
  private rsiYscale!: ScaleLinear<number, number>;
  private _xScale!: ScaleBand<Date>;
  private gRsi!: Selection<SVGGElement, unknown, null, undefined>;
  private rollingPeriod = 14;

  constructor(
    private dataService: ChartDataService,
    private rsiLayout: RsiChartLayoutService
  ) { }

  public xScale(scale: ScaleBand<Date>): this {
    this._xScale = scale;
    return this;
  }

  public setTargetGroup(gTargetRef: SVGGElement | Element): this {
    this.gRsi = select(gTargetRef as SVGGElement)
      .attr('class', 'rsi-chart');

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

    for (let i = 1; i < this.rollingPeriod; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gainSum += change;
      } else {
        lossSum -= change;
      }
    }

    for (let i = this.rollingPeriod; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;

      if (change > 0) {
        gainSum = (gainSum * (this.rollingPeriod - 1) + change) / this.rollingPeriod;
        lossSum = (lossSum * (this.rollingPeriod - 1)) / this.rollingPeriod;
      } else {
        gainSum = (gainSum * (this.rollingPeriod - 1)) / this.rollingPeriod;
        lossSum = (lossSum * (this.rollingPeriod - 1) - change) / this.rollingPeriod;
      }

      const rs = lossSum === 0 ? 100 : gainSum / lossSum;
      const rsi = 100 - 100 / (1 + rs);

      rsiValues.push({
        date: data[i].date,
        rsi
      });
    }

    return rsiValues;
  }

  public drawAxes(chartScaffold: Scaffold): this {
    const panel = chartScaffold.panels?.[ChartType.RSI];
    if (!panel) {
      return this;
    }

    const contentHeight = Math.max(0, panel.contentRect.height ?? 0);

    this.rsiYscale = scaleLinear<number, number>()
      .domain([0, 100])
      .range([contentHeight, 0]);

    const leftAxis = axisLeft(this.rsiYscale);
    const rightAxis = axisRight(this.rsiYscale);

    this.rsiLayout.axisLeft.gAxis.call(leftAxis);
    this.rsiLayout.axisRight.gAxis.call(rightAxis);

    return this;
  }

  public draw(): void {
    if (!this.gRsi || !this._xScale || !this.rsiYscale) {
      return;
    }

    const parsedData = this.dataService.parsedData ?? [];
    const rsiData = this.calculateRsi(parsedData);

    const rsiLine = line<{ date: Date; rsi: number }>()
      .x((d) => (this._xScale(d.date) ?? 0) + this._xScale.bandwidth() / 2)
      .y((d) => {
        const y = this.rsiYscale(d.rsi);
        return Number.isNaN(y) ? this.rsiYscale(50) : y;
      });

    const rsiPath = this.gRsi
      .selectAll<SVGPathElement, { date: Date; rsi: number }[]>('.rsi-line')
      .data([rsiData]);

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

    this.drawThresholdLine(70, 'overbought', '4, 2');
    this.drawThresholdLine(30, 'oversold', '4, 2');
    this.drawThresholdLine(50, 'middle', 'none');
  }

  private drawThresholdLine(level: number, className: string, strokeDasharray: string): void {
    if (!this.gRsi || !this._xScale || !this.rsiYscale) {
      return;
    }

    const thresholdLine = this.gRsi
      .selectAll<SVGLineElement, number>(`.${className}-line`)
      .data([level]);

    const [xStart, xEnd] = this._xScale.range();

    thresholdLine
      .enter()
      .append('line')
      .attr('class', `${className}-line`)
      .merge(thresholdLine)
      .attr('x1', xStart)
      .attr('x2', xEnd)
      .attr('y1', this.rsiYscale(level))
      .attr('y2', this.rsiYscale(level))
      .attr('stroke', className === 'middle' ? 'gray' : 'red')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', strokeDasharray)
      .attr('fill', 'none');

    thresholdLine.exit().remove();
  }
}
