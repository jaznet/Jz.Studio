import { Type } from "@angular/core";

export interface ChartComponentFactory {
  chartType: string; // e.g. 'macd', 'ohlc'
  component: Type<any>;
}
