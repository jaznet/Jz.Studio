
import { Injectable } from '@angular/core';
import { Selection, select } from 'd3-selection';
import { Axis, AxisDomain, axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { ChartDataService } from '../../chart-data.service';
import { ScalesService } from '../../scales.service';
import { scaffold } from '../../../interfaces/techan-interfaces';
import { VolumeChartLayoutService } from './volume-chart-layout.service';

@Injectable({
  providedIn: 'root',
})
export class VolumeChartService {
  private _xScale: any;
  private _barWidth: number = 0;
  private gVolume: any;

  volumeYscale: any;

  //gVolumeSection!: Selection<SVGGElement, unknown, null, undefined>;
  //rVolumeSection!: Selection<SVGRectElement, unknown, null, undefined>;
  //gVolumeSectionContent!: Selection<SVGGElement, unknown, null, undefined>;
  //rVolumeSectionContent!: Selection<SVGRectElement, unknown, null, undefined>;

  //VolumeAxisLeft: any;
  //gVolumeAxisGroupLeft: any;
  //rVolumeAxisLeft: any;

  //gVolumeAxisRight: any;
  //gVolumeAxisGroupRight: any;
  //rVolumeAxisRight: any;

  axisLeft!: Axis<AxisDomain>;
  axisRight!: Axis<AxisDomain>;

  constructor(
    private scales: ScalesService,
    private data: ChartDataService,
    private volume: VolumeChartLayoutService
  ) { }

  public xScale(scale: any): this {
    this._xScale = scale;
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

  public drawAxes(scaffold:scaffold) {
    this.volumeYscale = scaleLinear()
      .domain([0, this.data.maxVolume ?? 10000000]) // Using minPrice and maxPrice to define the domain
      .range([scaffold.sections[1].height, 0]); // Invert the range for correct orientation (top to bottom)

    //this.gAxisLeft = select(this.gAxisLeft);
    //this.gVolumeAxisRight = select(this.gVolumeAxisRight);

    this.axisLeft = axisLeft(this.volumeYscale)
      .tickFormat((d) => (d as number / 1_000_000).toFixed(0)); // or toFixed(1) for 1 decimal

    this.axisRight = axisRight(this.volumeYscale)
      .tickFormat((d) => (d as number / 1_000_000).toFixed(0));

    this.volume.gAxisLeft.call(this.axisLeft);
    this.volume.gAxisRight.call(this.axisRight);

    return this;
  }

  public draw(): void {
    const parsedData = this.data.parsedData;

    const volumeBars = this.gVolume.selectAll('.volume-bar').data(parsedData);

    volumeBars.enter()
      .append('rect')
      .attr('class', 'volume-bar')
      .merge(volumeBars)
      .attr('x', (d: { date: Date }) => this._xScale(d.date.toISOString()) ?? 0) // Convert Date to string
      .attr('y', (d: { volume: number }) => this.volumeYscale(d.volume))
      .attr('width', this._xScale.bandwidth()) // Use scaleBand's bandwidth
      .attr('height', (d: { volume: number }) => this.volumeYscale(0) - this.volumeYscale(d.volume))
      .attr('fill', (d: { open: number; close: number }) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    volumeBars.exit().remove();
  }

}
