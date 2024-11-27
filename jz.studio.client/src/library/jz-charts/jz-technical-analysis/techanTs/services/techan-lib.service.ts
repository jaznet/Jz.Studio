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
          .attr("fill", (d: CandlestickData) => d.open > d.close ? "black" : "white");

        // Exit
        candle.exit().remove();
      }

    };

    return candlestickPlot;
  }
}
