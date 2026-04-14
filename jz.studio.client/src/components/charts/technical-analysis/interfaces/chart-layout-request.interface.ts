import { ChartType } from '../enums/chart-type';
import { Margins } from './techan-interfaces';
import { PanelDefinition } from './panel-interfaces';

export interface ChartLayoutRequest {
  width: number;
  height: number;
  margins: Margins;
  titleWidth: number;
  titleHeight: number;

  axisLeftWidth: number;
  axisRightWidth: number;
  xAxisTopHeight: number;
  xAxisBottomHeight: number;
  panelGap: number;
  panels: PanelDefinition[];
}
