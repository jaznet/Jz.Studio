import { Injectable } from '@angular/core';
import { CandlestickData } from '../interfaces/techan-interfaces';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class TechanLibService {

  candleWidth = 7;

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
      draw: function (selection: any, data: CandlestickData[], candleWidth: any, parsedData:any) {
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
