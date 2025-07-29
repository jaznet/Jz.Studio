import { ChartType } from "../enums/chart-type";
import { SectionAttributes } from "./section-attributes";

export interface ChartScaffold {
  height: number;
  width: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
  sectionsContainer: any; // You can tighten this later
  sections: { [key in ChartType]?: SectionAttributes } | undefined;

};

