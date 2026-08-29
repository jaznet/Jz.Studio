// technical-analysis-panel-preferences.ts

import { ChartType } from "./enums/chart-type";
import { PanelPreference } from "./interfaces/panel-preference.interface";


export const DEFAULT_PANEL_PREFERENCES: PanelPreference[] = [
  {
    id: 'ohlc',
    chartType: ChartType.OHLC,
    order: 1,
    visible: true,
    ratio: 0.5,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  },
  {
    id: 'volume',
    chartType: ChartType.VOLUME,
    order: 2,
    visible: true,
    ratio: 0.2,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  },
  {
    id: 'macd',
    chartType: ChartType.MACD,
    order: 3,
    visible: true,
    ratio: 0.13,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  },
  {
    id: 'rsi',
    chartType: ChartType.RSI,
    order: 4,
    visible: true,
    ratio: 0.17,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  }
];
