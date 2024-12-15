import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
/*import * as d3 from 'd3';*/
import { CandlestickData } from '../../interfaces/techan-interfaces';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select, selection, selectAll } from 'd3-selection';
import { max, min, extent } from 'd3-array';

@Component({
  selector: 'candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements AfterViewInit {
  @Input() data: CandlestickData[] = []; // Input to accept candlestick data
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<SVGElement>;

  private svg: any;
  private xScale: any;
  private yScale: any;
  private chartWidth = 800;
  private chartHeight = 400;

  ngAfterViewInit(): void {
    this.initializeChart();
    this.drawChart();
  }

  private initializeChart(): void {
    // Initialize SVG
    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);

    // Initialize scales
    this.xScale = scaleBand<Date>()
      .domain(this.data.map(d => d.date))
      .range([0, this.chartWidth])
      .padding(0.1);

    const priceValues = this.data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = min(priceValues) ?? 0;
    const maxPrice = max(priceValues) ?? 100;

    this.yScale = scaleLinear()
      .domain([minPrice, maxPrice])
      .range([this.chartHeight, 0]);
  }

  private drawChart(): void {
    // Draw candlestick bodies
    const candle = this.svg.selectAll('.candle')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'candle')
      .attr('x', (d: CandlestickData) => this.xScale(d.date) ?? 0)
      .attr('y', (d: CandlestickData) => this.yScale(Math.max(d.open, d.close)))
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d: CandlestickData) => Math.abs(this.yScale(d.open) - this.yScale(d.close)))
      .attr('fill', (d: CandlestickData) => d.open > d.close ? '#bf211e' : 'seagreen');

    // Draw candlestick wicks
    const wicks = this.svg.selectAll('.wick')
      .data(this.data)
      .enter()
      .append('line')
      .attr('class', 'wick')
      .attr('x1', (d: CandlestickData) => (this.xScale(d.date) ?? 0) + this.xScale.bandwidth() / 2)
      .attr('x2', (d: CandlestickData) => (this.xScale(d.date) ?? 0) + this.xScale.bandwidth() / 2)
      .attr('y1', (d: CandlestickData) => this.yScale(d.high))
      .attr('y2', (d: CandlestickData) => this.yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);
  }
}
