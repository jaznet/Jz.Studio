
// import other chart components...

import { Type } from "@angular/core";
import { OhlcChartComponent } from "../components/ohlc-chart/ohlc-chart.component";
import { ChartType } from "../enums/chart-type";

export const ChartComponentMap: Partial<Record<ChartType, Type<any>>> = {
  [ChartType.OHLC]: OhlcChartComponent,
//  [ChartType.MACD]: MacdChartComponent,
  // [ChartType.RSI]: RsiChartComponent,
  // ...
};
