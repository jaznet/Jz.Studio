import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
/*import * as d3 from 'd3';*/
import { CandlestickData } from '../../interfaces/techan-interfaces';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select, selection, selectAll } from 'd3-selection';
import { max, min, extent } from 'd3-array';

//@Component({
//  selector: 'candlestick-chart',
//  templateUrl: './candlestick-chart.component.html',
//  styleUrls: ['./candlestick-chart.component.css']
//})
export class CandlestickChartComponent  {
/*  @Input() data: CandlestickData[] = []; // Input to accept candlestick data*/
/*  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<SVGElement>;*/

  private svg: any;
  private xScale: any;
  private yScale: any;
  private chartWidth = 800;
  private chartHeight = 400;

  constructor() {

  }

  //ngAfterViewInit(): void {
  //  this.initializeChart();
  ////  this.drawChart();
  //}

  private initializeChart(): void {
    // Initialize SVG
    //this.svg = select(this.chartContainer.nativeElement)
    //  .append('svg')
    //  .attr('width', this.chartWidth)
    //  .attr('height', this.chartHeight);

    //// Initialize scales
    //this.xScale = scaleBand<Date>()
    //  .domain(this.data.map(d => d.date))
    //  .range([0, this.chartWidth])
    //  .padding(0.1);

    //const priceValues = this.data.flatMap(d => [d.open, d.high, d.low, d.close]);
    //const minPrice = min(priceValues) ?? 0;
    //const maxPrice = max(priceValues) ?? 100;

    //this.yScale = scaleLinear()
    //  .domain([minPrice, maxPrice])
    //  .range([this.chartHeight, 0]);
  }

  public plot = {
    candlestick: () => this.createCandlestickPlot()
  };

  private createCandlestickPlot() {
    // Create scales to be used for plotting
    let xScale: any;
    let yScale: any;

    const candlestickPlot = {
      xScale: function (scale: any) {
        xScale = scale;
        return this;
      },
      yScale: function (scale: any) {
        yScale = scale;
        return this;
      },
      draw: function (selection: any, data: CandlestickData[], candleWidth: any, parsedData: any) {
        const candle = selection.selectAll(".candle").data(parsedData);

        // Enter
        candle.enter()
          .append("rect")
          .attr("class", "candle")
          .merge(candle)
          .attr("x", (d: CandlestickData) => xScale(d.date) ?? 0) // ?? 0 to provide a default if null
          .attr("y", (d: CandlestickData) => yScale(Math.max(d.open, d.close)))
          .attr("width", candleWidth) // Now this will work because xScale is a scaleBand
          .attr("height", (d: CandlestickData) => Math.abs(yScale(d.open) - yScale(d.close)))
          .attr("fill", (d: CandlestickData) => d.open > d.close ? "#bf211e" : "seagreen");

        // Exit
        candle.exit().remove();

        // Draw wicks
        const wicks = selection.selectAll(".wick").data(parsedData);

        // Enter for wicks
        wicks.enter()
          .append("line")
          .attr("class", "wick")
          .merge(wicks)
          .attr("x1", (d: CandlestickData) => xScale(d.date)! + candleWidth / 2) // Center of the candlestick
          .attr("x2", (d: CandlestickData) => xScale(d.date)! + candleWidth / 2)
          .attr("y1", (d: CandlestickData) => yScale(d.high)) // Top of the wick (highest price)
          .attr("y2", (d: CandlestickData) => yScale(d.low)) // Bottom of the wick (lowest price)
          .attr("stroke", "#52aa8a")
          .attr("stroke-width", 1);

        // Exit for wicks
        wicks.exit().remove();
      }
    };

    return candlestickPlot;
  }
}
