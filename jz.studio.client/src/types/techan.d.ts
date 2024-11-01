declare module 'techan' {
  import * as d3 from 'd3';

  export interface Indicator {
    (data: any[]): any[];
    accessor(): any;
    period(): number;
    period(period: number): this;
    overbought(): number;
    overbought(overbought: number): this;
    oversold(): number;
    oversold(oversold: number): this;
    strokeWidth(): number;
    strokeWidth(strokeWidth: number): this;
  }

  export interface IndicatorFactory {
    atr(): Indicator;
    rsi(): Indicator;
    sma(): Indicator;
    ema(): Indicator;
    macd(): Indicator;
    // Add more indicators as needed
  }

  export interface Plot {
    (selection: d3.Selection<any, any, any, any>): void;
    accessor(): any;
    xScale(): d3.ScaleTime<number, number>;
    xScale(scale: d3.ScaleTime<number, number>): this;
    yScale(): d3.ScaleLinear<number, number>;
    yScale(scale: d3.ScaleLinear<number, number>): this;
  }

  export interface PlotFactory {
    atr(): Plot;
    rsi(): Plot;
    sma(): Plot;
    ema(): Plot;
    macd(): Plot;
    candlestick(): Plot;
    // Add more plot types as needed
  }

  export interface ScaleFactory {
    ohlc(): d3.ScaleLinear<number, number>;
    financetime(): d3.ScaleTime<number, number>;
  }

  export interface Accessor {
    ohlc(): any;
    macd(): any;
  }

  export interface Techan {
    indicator: IndicatorFactory;
    plot: PlotFactory;
    scale: ScaleFactory;
    accessor: Accessor;
  }

  // Modify the default export to be callable, accepting d3 and returning a Techan instance
  // Declare `techan` as a callable function
  const techan: (d3: typeof d3) => Techan;
  export default techan;


}
