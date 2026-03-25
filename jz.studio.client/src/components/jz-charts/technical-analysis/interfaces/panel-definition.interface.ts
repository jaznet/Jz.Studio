import { ChartType } from "../enums/chart-type";

export interface PanelDefinition {
  id: string;
  chartType: ChartType;
  ratio: number;

  showAxisLeft?: boolean;
  showAxisRight?: boolean;
  showXAxisTop?: boolean;
  showXAxisBottom?: boolean;
}
