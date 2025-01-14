
import { Injectable } from '@angular/core';
import { ChartDataService } from '../chart-data.service';
import { select } from 'd3-selection';
import { ChartScalesService } from '../chart-scales.service';
import { CandlestickData } from '../../interfaces/techan-interfaces';
import { ChartLayoutService } from '../chart-layout.service';

@Injectable({
  providedIn: 'root',
})
export class VolumeChartService {
  private _xScale: any;
  private _yScale: any;
  private _barWidth: number = 0;
  private gVolume: any;

  constructor(
    private scales: ChartScalesService,
    private data: ChartDataService,
  private layout: ChartLayoutService
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
      .attr("class", "candlestick")
      .attr("transform", `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.margins.top})`);
    return this;
  }

  public setBarWidth(): this {
    // Calculate the width of each volume bar
    const timeDiff = this.data.parsedData.length > 1
      ? this.data.parsedData[1].date.getTime() - this.data.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds

    this._barWidth =
      this.scales.candlestickXscale(new Date(this.data.parsedData[0].date.getTime() + timeDiff)) -
      this.scales.candlestickXscale(this.data.parsedData[0].date);

    return this; // Enables method chaining
  }

  public draw(): void {
   // this.gVolume = gVolume;

    const parsedData = this.data.parsedData;

    const volumeBars = this.gVolume.selectAll('.volume-bar').data(parsedData);

    // Enter
    //  volumeBars
    //    .enter()
    //    .append('rect')
    //    .attr('class', 'volume-bar')
    //    .merge(volumeBars)
    //    .attr('x', (d: CandlestickData) => this._xScale(d.date) ?? 0)
    //    .attr('y', (d: CandlestickData) => this._yScale(d.volume))
    //    .attr('width', this._barWidth)
    //    .attr('height', (d: CandlestickData) => this._yScale(0) - this._yScale(d.volume))
    //    .attr('fill', (d: CandlestickData) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    //  // Exit
    //  volumeBars.exit().remove();
    //}
  }
}
