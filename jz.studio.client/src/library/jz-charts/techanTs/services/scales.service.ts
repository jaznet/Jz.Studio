
import { Injectable } from '@angular/core';
import { ChartDataService } from './chart-data.service';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { ChartType } from '../enums/chart-type';
import { ChartScaffold } from '../interfaces/chart-scaffold';

@Injectable({
  providedIn: 'root'
})
export class _ScalesService {

  dateScaleX!: any;

  constructor(
    private data: ChartDataService) {
  }

  //_createScales(scaffold: ChartScaffold) {
  //  if (this.data.dateExtent[0] && this.data.dateExtent[1]) {
  //    this.dateScaleX = scaleBand()
  //      .domain(this.data.parsedData.map(d => d.date.toISOString())) // Ensure only valid trading days
  //      .range([0, scaffold.sections![ChartType.OHLC]!.width - scaffold.sections![ChartType.OHLC]!.margins.left - scaffold.sections![ChartType.OHLC]!.margins.right])
  //      .padding(0.1); // Adjust padding if needed
  //  } else {
  //    // Handle the case where extent is undefined, e.g., set a default domain
  //    this.dateScaleX = scaleBand()
  //      .domain([])
  //      .range([0, scaffold.sections![ChartType.OHLC]!.width]);
  //  }
  //}
}
