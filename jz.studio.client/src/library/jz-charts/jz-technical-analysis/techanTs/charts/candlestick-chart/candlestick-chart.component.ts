// candlestick-chart.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
/*import * as d3 from 'd3';*/
import { max, min, extent } from 'd3-array';
import { scaleTime, scaleLinear } from 'd3-scale';

@Component({
  selector: 'candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.getData();

    //const candlestickXScale = scaleTime()
    //  .domain(extent(data, d => d.date) as [Date, Date])
    //  .range([0, element.offsetWidth]);

    //const candlestickYScale = scaleLinear()
    //  .domain([0, max(data, d => d.high) as number])
    //  .range([element.offsetHeight, 0]);

    // Render candlestick chart using xScale and yScale
  }

  private getData() {
    // Fetch or generate data
    return [];
  }
}
