
import { Injectable } from '@angular/core';
import { ChartDataService } from './chart-data.service';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { LayoutService } from './layout.service';
import { AxisScale, AxisDomain, ScaleLinear } from 'd3-v4';

@Injectable({
  providedIn: 'root'
})
export class ChartScalesService {

  dateScaleX!: any;
  ohlcYscale!: any;
  volumeYscale: any;
  macdYscale: any;
  rsiYscale: any;

  constructor(private data: ChartDataService,

    private layout: LayoutService) { }

  createScales() {
    if (this.data.dateExtent[0] && this.data.dateExtent[1]) {
      this.dateScaleX = scaleBand()
        .domain(this.data.parsedData.map(d => d.date.toISOString())) // Ensure only valid trading days
        .range([0, this.layout.sectAttr_A.width - this.layout.sectAttr_A.margins.left - this.layout.sectAttr_A.margins.right])
        .padding(0.1); // Adjust padding if needed
    } else {
      // Handle the case where extent is undefined, e.g., set a default domain
      this.dateScaleX = scaleBand()
        .domain([])
        .range([0, this.layout.sectAttr_A.width]);
    }

    this.ohlcYscale = scaleLinear()
      .domain([this.data.minPrice ?? 0, this.data.maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([this.layout.sectionRectA.height.baseVal.value* .75, 0]); // Invert the range for correct orientation (top to bottom)

    this.volumeYscale = scaleLinear()
      .domain([0, this.data.maxVolume ?? 10000000]) // Using minPrice and maxPrice to define the domain
      .range([this.layout.sectionAvolume.getBBox().height, 0]); // Invert the range for correct orientation (top to bottom)

    /*   this.macdYscale = */

    console.log(this.layout.sectionAvolume.getBBox().height);
  }

  createMacdYScale(macdData: { macd: number; signal: number; histogram: number }[], chartHeight: number): any {
    // Calculate the min and max values from MACD data
    const allValues = macdData.flatMap(d => [d.macd, d.signal, d.histogram]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    // Create the y-scale
    this.macdYscale = scaleLinear()
      .domain([min, max]) // Domain based on MACD values
      .range([chartHeight, 0]); // Range based on the chart height
  }

  createRsiYScale(chartHeight: number) {
    this.rsiYscale = scaleLinear().domain([0, 100]).range([chartHeight, 0]);
  }
}
