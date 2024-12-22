import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CandlestickData } from '../../interfaces/techan-interfaces';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select, selection, selectAll } from 'd3-selection';
import { max, min, extent } from 'd3-array';
export class CandlestickChartComponent  {

  private section: any;
  private svg: any;
  private xScale: any;
  private yScale: any;
  private chartWidth = 800;
  private chartHeight = 400;

  constructor(section: any) {
    this.section = section;
    console.log(section);
  }

  public plot = {
    candlestick: () => this.createCandlestickPlot()
  };

  private createCandlestickPlot() {
    const candlestickPlot = {
      section: "zany",
      _xScale: null as any, // Declare _xScale
      _yScale: null as any, // Declare _yScale
      xScale: function (scale: any) {
        this._xScale = scale; // Assign scale to _xScale
        return this;
      },
      yScale: function (scale: any) {
        this._yScale = scale; // Assign scale to _yScale
        return this;
      },
      test: function (section: any) {
        const circle = section
          .append('circle')
          .attr('cx', 50)
          .attr('cy', 50)
          .attr('r', 10)
          .attr('fill', 'blue');
      },
      draw: (selection: any, data: CandlestickData[], candleWidth: any, parsedData: any) => {
        // Draw wicks
        const wicks = selection.selectAll(".wick").data(parsedData);

        wicks.enter()
          .append("line")
          .attr("class", "wick")
          .merge(wicks)
          .attr("x1", (d: CandlestickData) => (candlestickPlot._xScale(d.date)! + candleWidth / 2))
          .attr("x2", (d: CandlestickData) => (candlestickPlot._xScale(d.date)! + candleWidth / 2))
          .attr("y1", (d: CandlestickData) => candlestickPlot._yScale(d.high))
          .attr("y2", (d: CandlestickData) => candlestickPlot._yScale(d.low))
          .attr("stroke", "#52aa8a")
          .attr("stroke-width", 1);

        // Exit for wicks
        wicks.exit().remove();

        console.log('Parsed Data', parsedData);
        const candle = selection.selectAll(".candle").data(parsedData);
        // Enter
        candle.enter()
          .append("rect")
          .attr("class", "candle")
          .merge(candle)
          .attr("x", (d: CandlestickData) => candlestickPlot._xScale(d.date) ?? 0) // Return x-coordinate
          .attr("y", (d: CandlestickData) => candlestickPlot._yScale(Math.max(d.open, d.close))) // Return y-coordinate
          .attr("width", candleWidth)
          .attr("height", (d: CandlestickData) => Math.abs(candlestickPlot._yScale(d.open) - candlestickPlot._yScale(d.close)))
          .attr("fill", (d: CandlestickData) => d.open > d.close ? "#bf211e" : "seagreen");

        // Exit
        candle.exit().remove();
      }
    };
    return candlestickPlot;
  }
}
