import { Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';
//import { scaleLinear, ScaleBand } from 'd3-scale';
import { scaleLinear, ScaleLinear, ScaleBand, NumberValue } from 'd3-scale';
import { Axis, AxisDomain, axisLeft, axisRight } from 'd3-axis';

import { ChartDataService } from '../../chart-data.service';
import { VolumeChartLayoutService } from './volume-chart-layout.service';
import { ChartType } from '../../../enums/chart-type';
import { Scaffold } from '../../../interfaces/scaffold.interface';

@Injectable({
  providedIn: 'root',
})
export class VolumeChartService {
  private _xScale!: ScaleBand<Date>;
  private _barWidth = 0;
  private gVolume!: Selection<SVGGElement, unknown, null, undefined>;

  volumeYscale!: ScaleLinear<number, number>;

  //axisLeft!: Axis<AxisDomain>;
  //axisRight!: Axis<AxisDomain>;

  constructor(
    private dataService: ChartDataService,
    private volume: VolumeChartLayoutService
  ) { }

  public xScale(scale: ScaleBand<Date>): this {
    this._xScale = scale;
    this._barWidth = Math.max(1, scale.bandwidth());
    return this;
  }

  public setTargetGroup(gTargetRef: SVGGElement | Element): this {
    this.gVolume = select(gTargetRef as SVGGElement)
      .attr('class', 'volume');

    return this;
  }

  public setBarWidth(): this {
    if (!this._xScale) {
      this._barWidth = 1;
      return this;
    }

    this._barWidth = Math.max(1, this._xScale.bandwidth());
    return this;
  }

  public drawAxes(scaffold: Scaffold): this {
    const panel = scaffold.panels?.[ChartType.VOLUME];
    if (!panel) {
      return this;
    }

    const contentHeight = Math.max(0, panel.contentRect.height ?? 0);

    this.volumeYscale = scaleLinear()
      .domain([0, this.dataService.maxVolume ?? 10_000_000])
      .range([contentHeight, 0])
      .nice();

    const leftAxis = axisLeft(this.volumeYscale)
      .tickFormat((d) => ((d as number) / 1_000_000).toFixed(0));

    const rightAxis = axisRight(this.volumeYscale)
      .tickFormat((d) => ((d as number) / 1_000_000).toFixed(0));

    this.volume.axisLeft.gAxis.call(leftAxis);
    this.volume.axisRight.gAxis.call(rightAxis);

    return this;
  }

  public draw(): void {
    if (!this.gVolume || !this._xScale || !this.volumeYscale) {
      return;
    }

    const parsedData = this.dataService.parsedData ?? [];

    const volumeBars = this.gVolume
      .selectAll<SVGRectElement, any>('.volume-bar')
      .data(parsedData);

    volumeBars
      .enter()
      .append('rect')
      .attr('class', 'volume-bar')
      .merge(volumeBars)
      .attr('x', (d: { date: Date }) => this._xScale(d.date) ?? 0)
      .attr('y', (d: { volume: number }) => this.volumeYscale(d.volume))
      .attr('width', this._barWidth)
      .attr('height', (d: { volume: number }) =>
        Math.max(0, this.volumeYscale(0) - this.volumeYscale(d.volume))
      )
      .attr('fill', (d: { open: number; close: number }) =>
        d.open > d.close ? '#bf211e' : 'seagreen'
      );

    volumeBars.exit().remove();
  }
}
