// chart-scaffold.service.ts

import { ChartType } from '../enums/chart-type';
import { PanelAttributes } from './panel-interfaces';
import { Margins } from './techan-interfaces';

export interface Scaffold {
  titleHeight: number;
  width: number;
  height: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
  margins: Margins;
  panelsContainer?: any;

  /** Panel attributes by chart type (OHLC, RSI, etc.) */
  panels?: Partial<Record<ChartType, PanelAttributes>>;
}
