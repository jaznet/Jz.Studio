// chart-config.ts

import { ChartType } from "../enums/chart-type";

export interface ChartConfigEntry {
  type: ChartType;
  include: boolean;
  height: number;
  margins: { top: number; right: number; bottom: number; left: number };
}

export const chartConfig: ChartConfigEntry[] = [
  { type: ChartType.OHLC, include: true, height: 300, margins: { top: 10, right: 30, bottom: 20, left: 50 } },
  { type: ChartType.MACD, include: true, height: 150, margins: { top: 5, right: 30, bottom: 15, left: 50 } },
  { type: ChartType.RSI, include: false, height: 120, margins: { top: 5, right: 30, bottom: 15, left: 50 } },
  { type: ChartType.VOLUME, include: false, height: 100, margins: { top: 5, right: 20, bottom: 15, left: 50 } }
];
