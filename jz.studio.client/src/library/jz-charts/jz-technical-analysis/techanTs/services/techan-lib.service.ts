
import { Injectable } from '@angular/core';
import { olhcData } from '../interfaces/techan-interfaces';
/*import * as d3 from 'd3';*/

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
      draw: function (selection: any, data: olhcData[], candleWidth: any, parsedData:any) {
        const candle = selection.selectAll(".candle").data(parsedData);

        // Enter
        candle.enter()
          .append("rect")
          .attr("class", "candle")
          .merge(candle)
          .attr("x", (d: olhcData) => xScale(d.date) ?? 0) // ?? 0 to provide a default if null
          .attr("y", (d: olhcData) => yScale(Math.max(d.open, d.close)))
          .attr("width", candleWidth) // Now this will work because xScale is a scaleBand
          .attr("height", (d: olhcData) => Math.abs(yScale(d.open) - yScale(d.close)))
          .attr("fill", (d: olhcData) => d.open > d.close ? "#bf211e" : "seagreen");

        // Exit
        candle.exit().remove();

        // Draw wicks
        const wicks = selection.selectAll(".wick").data(parsedData);

        // Enter for wicks
        wicks.enter()
          .append("line")
          .attr("class", "wick")
          .merge(wicks)
          .attr("x1", (d: olhcData) => xScale(d.date)! + candleWidth / 2) // Center of the candlestick
          .attr("x2", (d: olhcData) => xScale(d.date)! + candleWidth / 2)
          .attr("y1", (d: olhcData) => yScale(d.high)) // Top of the wick (highest price)
          .attr("y2", (d: olhcData) => yScale(d.low)) // Bottom of the wick (lowest price)
          .attr("stroke", "#52aa8a")
          .attr("stroke-width", 1);

        // Exit for wicks
        wicks.exit().remove();
      }
    };

    return candlestickPlot;
  }
}
