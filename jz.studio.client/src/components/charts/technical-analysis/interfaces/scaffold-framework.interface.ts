// chart-scaffold.service.ts

import { ChartType } from '../enums/chart-type';
import { Rect } from './common-interfaces';
import { PanelAttributes } from './panel-interfaces';
import { Margins } from './techan-interfaces';

export interface ScaffoldFramework {
  titleWidth: number;
  titleHeight: number;
  width: number;
  height: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
  margins: Margins;
  panelHostsContainer?: Rect;

  /** Panel attributes by chart type (OHLC, RSI, etc.) */
  panels?: Partial<Record<ChartType, PanelAttributes>>;
}
