
import { ElementRef } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { AxisLayout, AxisLayoutRefs } from '../../parts/axis-layout';

export abstract class BaseChartLayoutService {
  gSection!: Selection<SVGGElement, unknown, null, undefined>;
  rSection!: Selection<SVGRectElement, unknown, null, undefined>;
  gContent!: Selection<SVGGElement, unknown, null, undefined>;
  rContent!: Selection<SVGRectElement, unknown, null, undefined>;
  gChart!: Selection<SVGGElement, unknown, null, undefined>;

  axisLeft = new AxisLayout();
  axisRight = new AxisLayout();

  initializeBase(refs: {
    gSection: ElementRef<SVGGElement>;
    rSection: ElementRef<SVGRectElement>;
    gContent: ElementRef<SVGGElement>;
    rContent: ElementRef<SVGRectElement>;
    gChart: ElementRef<SVGGElement>;

    axisLeft: AxisLayoutRefs;
    axisRight: AxisLayoutRefs;
  }): void {
    this.gSection = select(refs.gSection.nativeElement);
    this.rSection = select(refs.rSection.nativeElement);
    this.gContent = select(refs.gContent.nativeElement);
    this.rContent = select(refs.rContent.nativeElement);
    this.gChart = select(refs.gChart.nativeElement);

    this.axisLeft.initialize(refs.axisLeft);
    this.axisRight.initialize(refs.axisRight);
  }
}
