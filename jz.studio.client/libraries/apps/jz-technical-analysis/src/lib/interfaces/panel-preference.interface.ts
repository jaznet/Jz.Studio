// panel-preference.interface.ts

import { ChartType } from '../enums/chart-type';

export interface PanelPreference {
  id: string;
  chartType: ChartType;
  order: number;
  visible: boolean;
  ratio: number;
  showAxisLeft?: boolean;
  showAxisRight?: boolean;
  showXAxisTop?: boolean;
  showXAxisBottom?: boolean;
}
