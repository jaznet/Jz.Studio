import { Injectable } from '@angular/core';
import { ChartDataService } from './chart-data.service';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { ChartLayoutService } from './chart-layout.service';

@Injectable({
  providedIn: 'root'
})
export class ChartScalesService {

  candlestickXscale!: any;
  candlestickYscale!: any;

  constructor(private data: ChartDataService,
 
  private layout:ChartLayoutService) { }

  createScales() {
    if (this.data.dateExtent[0] && this.data.dateExtent[1]) {
      this.candlestickXscale = scaleTime()
        .domain(this.data.dateExtent)
        .range([0, this.layout.sectionA.width - this.layout.sectionA.margins.left - this.layout.sectionA.margins.right]);
    } else {
      // Handle the case where extent is undefined, e.g., set a default domain
      this.candlestickXscale = scaleTime()
        .domain([new Date(), new Date()]) // Default to current date
        .range([0, this.layout.sectionA.width - this.layout.sectionA.margins.left - this.layout.sectionA.margins.right]);
    }

    this.candlestickYscale = scaleLinear()
      .domain([this.data.minPrice ?? 0, this.data.maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([this.layout.sectionA.height - this.layout.sectionA.margins.top - this.layout.sectionA.margins.bottom, 0]); // Invert the range for correct orientation (top to bottom)
  }
}
