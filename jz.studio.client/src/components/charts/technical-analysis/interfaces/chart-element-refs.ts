import { ElementRef } from '@angular/core';
import { AxisLayoutRefs } from '../services/parts/axis-layout';

export interface ChartElementRefs {
  gContainer: ElementRef<SVGGElement>;
  rContainer: ElementRef<SVGRectElement>;
  axisLeft: AxisLayoutRefs;
  gChart: ElementRef<SVGGElement>;
  axisRight: AxisLayoutRefs;
}
