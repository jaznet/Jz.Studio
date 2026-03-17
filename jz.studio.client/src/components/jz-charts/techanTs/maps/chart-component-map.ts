
// import other chart components...

import { Type } from "@angular/core";
import { ChartType } from "../enums/chart-type";
import { OhlcChartComponent } from "../charts/ohlc/ohlc-chart.component";
import { MacdChartComponent } from "../charts/macd/macd-chart.component";
import { RsiChartComponent } from "../charts/rsi/rsi-chart.component";
import { VolumeChartComponent } from "../charts/volume/volume-chart.component";

export const ChartComponentMap: Partial<Record<ChartType, Type<any>>> = {
  [ChartType.OHLC]: OhlcChartComponent,
  [ChartType.VOLUME]: VolumeChartComponent,
  [ChartType.MACD]: MacdChartComponent,
   [ChartType.RSI]: RsiChartComponent,
  // ...
};
