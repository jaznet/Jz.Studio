import { ChartType } from "../enums/chart-type";
import { SectionAttributes } from "./section-attributes";

export interface ChartScaffold {
  height: number;
  width: number;
  title: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
  panelsContainer: any; // You can tighten this later
  panels: { [key in ChartType]?: SectionAttributes } | undefined;

};

