import { ChartType } from "../enums/chart-type";
import { PanelAttributes } from "./panel-attributes";

export interface ChartScaffold {
  height: number;
  width: number;
  title: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
  panelsContainer: any; // You can tighten this later
  panels: { [key in ChartType]?: PanelAttributes } | undefined;

};

