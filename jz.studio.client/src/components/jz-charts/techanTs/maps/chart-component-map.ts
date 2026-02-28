
// import other chart components...

import { Type } from "@angular/core";
import { OhlcChartComponent } from "../components/ohlc-chart/ohlc-chart.component";
import { ChartType } from "../enums/chart-type";
import { VolumeChartComponent } from "../components/volume-chart/volume-chart.component";
import { MacdChartComponent } from "../components/macd-chart/macd-chart.component";
import { RsiChartComponent } from "../components/rsi-chart/rsi-chart.component";

export const ChartComponentMap: Partial<Record<ChartType, Type<any>>> = {
  [ChartType.OHLC]: OhlcChartComponent,
  [ChartType.VOLUME]: VolumeChartComponent,
  [ChartType.MACD]: MacdChartComponent,
   [ChartType.RSI]: RsiChartComponent,
  // ...
};
