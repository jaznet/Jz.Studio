import { Injectable } from '@angular/core';
import { CandlestickData } from '../interfaces/techan-interfaces';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class TechanLibService {

  constructor() { }

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
      draw: function (selection: any, data: CandlestickData[]) {
        const candle = selection.selectAll(".candle").data(data);

        // Enter
        candle.enter()
          .append("rect")
          .attr("class", "candle")
          .merge(candle)
          .attr("x", (d: CandlestickData) => xScale(d.date) ?? 0) // ?? 0 to provide a default if null
          .attr("y", (d: CandlestickData) => yScale(Math.max(d.open, d.close)))
          .attr("width", xScale.bandwidth()) // Now this will work because xScale is a scaleBand
          .attr("height", (d: CandlestickData) => Math.abs(yScale(d.open) - yScale(d.close)))
          .attr("fill", (d: CandlestickData) => d.open > d.close ? "#800E13" : "#166916");

        // Exit
        candle.exit().remove();

        // Draw wicks
        const wicks = selection.selectAll(".wick").data(data);

        // Enter for wicks
        wicks.enter()
          .append("line")
          .attr("class", "wick")
          .merge(wicks)
          .attr("x1", (d: CandlestickData) => xScale(d.date)! + xScale.bandwidth() / 2) // Center of the candlestick
          .attr("x2", (d: CandlestickData) => xScale(d.date)! + xScale.bandwidth() / 2)
          .attr("y1", (d: CandlestickData) => yScale(d.high)) // Top of the wick (highest price)
          .attr("y2", (d: CandlestickData) => yScale(d.low)) // Bottom of the wick (lowest price)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        // Exit for wicks
        wicks.exit().remove();
      }



    };

    return candlestickPlot;
  }
}
