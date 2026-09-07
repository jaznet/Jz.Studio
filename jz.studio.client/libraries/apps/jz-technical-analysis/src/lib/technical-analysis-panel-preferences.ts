// technical-analysis-panel-preferences.ts

import { ChartType } from "./enums/chart-type";
import { PanelPreference } from "./interfaces/panel-preference.interface";

export const DEFAULT_INDICATOR_SLOTS: Readonly<Record<
  'slot-1' | 'slot-2' | 'slot-3',
  ChartType
>> = {
  'slot-1': ChartType.VOLUME,
  'slot-2': ChartType.MACD,
  'slot-3': ChartType.RSI
};

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
    id: 'slot-1',
    chartType: DEFAULT_INDICATOR_SLOTS['slot-1'],
    order: 2,
    visible: true,
    ratio: 0.2,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  },
  {
    id: 'slot-2',
    chartType: DEFAULT_INDICATOR_SLOTS['slot-2'],
    order: 3,
    visible: true,
    ratio: 0.13,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  },
  {
    id: 'slot-3',
    chartType: DEFAULT_INDICATOR_SLOTS['slot-3'],
    order: 4,
    visible: true,
    ratio: 0.17,
    showAxisLeft: true,
    showAxisRight: true,
    showXAxisTop: false,
    showXAxisBottom: false
  }
];
