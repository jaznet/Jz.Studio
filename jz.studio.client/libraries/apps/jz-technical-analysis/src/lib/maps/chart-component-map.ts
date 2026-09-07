
// import other chart components...

import { Type } from "@angular/core";
import { ChartType } from "../enums/chart-type";
import { OhlcChartComponent } from "../charts/ohlc/ohlc-chart.component";
import { MacdChartComponent } from "../charts/macd/macd-chart.component";
import { RsiChartComponent } from "../charts/rsi/rsi-chart.component";
import { VolumeChartComponent } from "../charts/volume/volume-chart.component";
import { AtrChartComponent } from "../charts/atr/atr-chart.component";
import { StochasticChartComponent } from "../charts/stochastic/stochastic-chart.component";
import { AdxChartComponent } from "../charts/adx/adx-chart.component";

export const ChartComponentMap: Partial<Record<ChartType, Type<any>>> = {
  [ChartType.OHLC]: OhlcChartComponent,
  [ChartType.VOLUME]: VolumeChartComponent,
  [ChartType.MACD]: MacdChartComponent,
   [ChartType.RSI]: RsiChartComponent,
  [ChartType.ATR]: AtrChartComponent,
  [ChartType.STOCHASTIC]: StochasticChartComponent,
  [ChartType.ADX]: AdxChartComponent,
  // ...
};
