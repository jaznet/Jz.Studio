import { Type } from "@angular/core";
import { ChartType } from "../enums/chart-type";

export interface ChartComponentFactory {
  chartType: ChartType;
  component: Type<any>;
}
