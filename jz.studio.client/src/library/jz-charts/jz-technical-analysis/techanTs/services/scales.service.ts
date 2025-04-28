
import { Injectable } from '@angular/core';
import { ChartDataService } from './chart-data.service';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { scaffold } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ScalesService {

  dateScaleX!: any;

  constructor(
    private data: ChartDataService) {
  }

  createScales(scaffold:scaffold) {
    if (this.data.dateExtent[0] && this.data.dateExtent[1]) {
      this.dateScaleX = scaleBand()
        .domain(this.data.parsedData.map(d => d.date.toISOString())) // Ensure only valid trading days
        .range([0, scaffold.sections[0].width - scaffold.sections[0].margins.left - scaffold.sections[0].margins.right])
        .padding(0.1); // Adjust padding if needed
    } else {
      // Handle the case where extent is undefined, e.g., set a default domain
      this.dateScaleX = scaleBand()
        .domain([])
        .range([0, scaffold.sections[0].width]);
    }
  }
}
