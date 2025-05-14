import { ElementRef } from '@angular/core';
import { AxisLayoutRefs } from '../services/parts/axis-layout';

export interface ChartElementRefs {
  gSection: ElementRef<SVGGElement>;
  rSection: ElementRef<SVGRectElement>;
  gContent: ElementRef<SVGGElement>;
  rContent: ElementRef<SVGRectElement>;
  gChart: ElementRef<SVGGElement>;

  axisLeft: AxisLayoutRefs;
  axisRight: AxisLayoutRefs;
}
