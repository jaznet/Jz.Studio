import { CandlestickData } from '../../interfaces/techan-interfaces';
import { select } from 'd3-selection';

export class CandlestickChartComponent {
  private _xScale: any;
  private _yScale: any;
  candleWidth = 10;

  constructor(private section: any) {
    console.log(section);
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
    return this;
}

  public draw(selection: any, data: CandlestickData[],  parsedData: any) {
    const wicks = selection.selectAll(".wick").data(parsedData);

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

    const candle = selection.selectAll(".candle").data(parsedData);

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
