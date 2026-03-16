
import { AfterViewInit, Injectable, Input } from '@angular/core';
import { Selection, select } from 'd3-selection';
import { Axis, AxisDomain, axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { ChartDataService } from '../../chart-data.service';
import { VolumeChartLayoutService } from './volume-chart-layout.service';
import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { LayoutService } from '../../../engine/layout/layout.service';

@Injectable({
  providedIn: 'root',
})
export class VolumeChartService implements AfterViewInit {
  @Input() dateScaleX!: any;
  private _xScale: any;
  private _barWidth: number = 0;
  private gVolume: any;

  volumeYscale: any;

  axisLeft!: Axis<AxisDomain>;
  axisRight!: Axis<AxisDomain>;

  constructor(
   private  dataService: ChartDataService,
   private layoutService:LayoutService,
    private volume: VolumeChartLayoutService
  ) { }

  ngAfterViewInit(): void {
//    this.volume.initializeSelections(this.buildRefs());
    }

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
    const timeDiff = this.dataService.parsedData.length > 1
      ? this.dataService.parsedData[1].date.getTime() - this.dataService.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds

    this._barWidth =
      this.dateScaleX(new Date(this.dataService.parsedData[0].date.getTime() + timeDiff)) -
    this.dateScaleX(this.dataService.parsedData[0].date);

    return this; // Enables method chaining
  }

  public drawAxes(scaffold: ChartScaffold) {
    this.volumeYscale = scaleLinear()
      .domain([0, this.dataService.maxVolume ?? 10000000]) // Using minPrice and maxPrice to define the domain
      .range([scaffold.panels![ChartType.VOLUME]!.height, 0]); // Invert the range for correct orientation (top to bottom)

    this.axisLeft = axisLeft(this.volumeYscale)
      .tickFormat((d) => (d as number / 1_000_000).toFixed(0)); // or toFixed(1) for 1 decimal

    this.axisRight = axisRight(this.volumeYscale)
      .tickFormat((d) => (d as number / 1_000_000).toFixed(0));

    this.volume.axisLeft.gAxis.call(this.axisLeft);
    this.volume.axisRight.gAxis.call(this.axisRight);

    return this;
  }

  public draw(): void {
    const parsedData = this.dataService.parsedData;

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
