// interfaces/chart-scaffold.ts
import { ChartType } from '../enums/chart-type';
import { PanelAttributes } from './panel-attributes';

export interface ChartScaffold {
  title: number;
  width: number;
  height: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;

  panelsContainer?: any;

  /** Panel attributes by chart type (OHLC, RSI, etc.) */
  panels?: Partial<Record<ChartType, PanelAttributes>>;
}
