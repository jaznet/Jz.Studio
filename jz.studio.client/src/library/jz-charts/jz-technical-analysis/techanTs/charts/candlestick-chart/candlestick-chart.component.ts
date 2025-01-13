import { CandlestickData } from '../../interfaces/techan-interfaces';
import { select } from 'd3-selection';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScalesService } from '../../services/chart-scales.service';

export class CandlestickChartComponent {
  private _xScale: any;
  private _yScale: any;
  candleWidth = 10;
  gCandlestick: any;

  constructor( //private section: any,
    private data: ChartDataService,
   private scales: ChartScalesService) {
  }

  public xScale(scale: any) {
    this._xScale = scale;
    return this;
  }

  public yScale(scale: any) {
    this._yScale = scale;
    return this;
  }

  public setCandleWidth() {
    // Calculate the width of each candlestick
    const dataTimeIntervals = this.data.parsedData.map((d: any, i: number) => {
      if (i === 0) return 0; // No interval for the first data point
      return this.data.parsedData[i].date.getTime() - this.data.parsedData[i - 1].date.getTime();
    }).filter((interval: number) => interval > 0); // Remove the first zero interval

    const averageTimeInterval = dataTimeIntervals.reduce((a: any, b: any) => a + b, 0) / dataTimeIntervals.length;
    const timeDiff = this.data.parsedData.length > 1
      ? this.data.parsedData[1].date.getTime() - this.data.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds
    const candleWidth =
      this.scales.candlestickXscale(new Date(this.data.parsedData[0].date.getTime() + timeDiff)) - this.scales.candlestickXscale(this.data.parsedData[0].date);
    return this;
}

  /*public draw(selection: any, data: CandlestickData[],  parsedData: any) {*/
  public draw() {
    const wicks = this.gCandlestick.selectAll(".wick").data(this.data.parsedData);

    wicks.enter()
      .append("line")
      .attr("class", "wick")
      .merge(wicks)
      .attr("x1", (d: CandlestickData) => this._xScale(d.date)! + this.candleWidth / 2)
      .attr("x2", (d: CandlestickData) => this._xScale(d.date)! + this.candleWidth / 2)
      .attr("y1", (d: CandlestickData) => this._yScale(d.high))
      .attr("y2", (d: CandlestickData) => this._yScale(d.low))
      .attr("stroke", "#52aa8a")
      .attr("stroke-width", 1);

    wicks.exit().remove();

    const candle = this.gCandlestick.selectAll(".candle").data(this.data.parsedData);

    candle.enter()
      .append("rect")
      .attr("class", "candle")
      .merge(candle)
      .attr("x", (d: CandlestickData) => this._xScale(d.date) ?? 0)
      .attr("y", (d: CandlestickData) => this._yScale(Math.max(d.open, d.close)))
      .attr("width", this.candleWidth)
      .attr("height", (d: CandlestickData) => Math.abs(this._yScale(d.open) - this._yScale(d.close)))
      .attr("fill", (d: CandlestickData) => d.open > d.close ? "#bf211e" : "seagreen");

    candle.exit().remove();
  }
}
