import { ChartType } from '../enums/chart-type';
import { Margins } from './techan-interfaces';

export interface ChartLayoutRequest {
  width: number;
  height: number;

  margins: Margins;

  titleHeight: number;
  xAxisTopHeight: number;
  xAxisBottomHeight: number;
  yAxisLeftWidth: number;
  yAxisRightWidth: number;

  panelGap: number;

  panelOrder: ChartType[];

  panelRatios: Partial<Record<ChartType, number>>;
}
