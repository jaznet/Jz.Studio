// chart-scaffold.service.ts

import { ChartType } from '../enums/chart-type';
import { DivRect } from './common-interfaces';
import { PanelAttributes } from './panel-interfaces';
import { Margins } from './techan-interfaces';

export interface ChartScaffold {
  width: number;
  height: number;
  xAxisTop: number;
  xAxisBottom: number;
  //yAxisLeft: number;
  //yAxisRight: number;
  margins: Margins;
  panelHostsContainer?: DivRect;
  chartMap?: Partial<Record<ChartType, PanelAttributes>>;
}
