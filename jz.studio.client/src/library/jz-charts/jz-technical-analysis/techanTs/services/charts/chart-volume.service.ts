
import { Injectable } from '@angular/core';
import { ChartDataService } from '../chart-data.service';
import { select } from 'd3-selection';
import { ScalesService } from '../scales.service';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { LayoutService } from '../layout.service';

@Injectable({
  providedIn: 'root',
})
export class VolumeChartService {
  private _xScale: any;
  private _yScale: any;
  private _barWidth: number = 0;
  private gVolume: any;

  volume_yAxisL: any;
  volume_yAxisL_grp: any;
  volume_yAxisL_rct: any;

  volume_yAxisR: any;
  volume_yAxisR_grp: any;
  volume_yAxisR_rct: any;

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
  private layout: LayoutService
  ) { }

  public xScale(scale: any): this {
    this._xScale = scale;
    return this; // Enables method chaining
  }

  public yScale(scale: any): this {
    this._yScale = scale;
    return this; // Enables method chaining
  }

  public setTargetGroup(gTargetRef: any) {
    this.gVolume = select(gTargetRef)
      .attr("class", "candlestick")  ;
    return this;
  }

  public setBarWidth(): this {
    // Calculate the width of each volume bar
    const timeDiff = this.data.parsedData.length > 1
      ? this.data.parsedData[1].date.getTime() - this.data.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds

    this._barWidth =
      this.scales.dateScaleX(new Date(this.data.parsedData[0].date.getTime() + timeDiff)) -
      this.scales.dateScaleX(this.data.parsedData[0].date);

    return this; // Enables method chaining
  }

  public draw(): void {
    const parsedData = this.data.parsedData;

    const volumeBars = this.gVolume.selectAll('.volume-bar').data(parsedData);

    volumeBars.enter()
      .append('rect')
      .attr('class', 'volume-bar')
      .merge(volumeBars)
      .attr('x', (d: { date: Date }) => this._xScale(d.date.toISOString()) ?? 0) // Convert Date to string
      .attr('y', (d: { volume: number }) => this._yScale(d.volume))
      .attr('width', this._xScale.bandwidth()) // Use scaleBand's bandwidth
      .attr('height', (d: { volume: number }) => this._yScale(0) - this._yScale(d.volume))
      .attr('fill', (d: { open: number; close: number }) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    volumeBars.exit().remove();
  }

}
