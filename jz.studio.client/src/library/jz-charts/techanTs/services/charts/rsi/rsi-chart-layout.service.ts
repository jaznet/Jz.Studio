import { Injectable, ElementRef } from '@angular/core';
import { BaseChartLayoutService } from '../base-chart-layout-service';
import { AxisLayoutRefs } from '../../parts/axis-layout';

@Injectable({ providedIn: 'root' })
export class RsiChartLayoutService extends BaseChartLayoutService {
  //axisLeft = new AxisLayout();
  //axisRight = new AxisLayout();

  initializeSelections(refs: {
    gSection: ElementRef<SVGGElement>;
    rSection: ElementRef<SVGRectElement>;
    gContent: ElementRef<SVGGElement>;
    rContent: ElementRef<SVGRectElement>;
    gChart: ElementRef<SVGGElement>;

    axisLeft: AxisLayoutRefs;
    axisRight: AxisLayoutRefs;
  }): void {
    this.initializeBase(refs);
    this.axisLeft.initialize(refs.axisLeft);
    this.axisRight.initialize(refs.axisRight);
  }
}
