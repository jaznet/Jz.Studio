
import { ElementRef } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { AxisLayout, AxisLayoutRefs } from '../../parts/axis-layout';

export abstract class BaseChartLayoutService {
  protected data: any[] = [];

  public gSection!: Selection<SVGGElement, unknown, null, undefined>;
  public rSection!: Selection<SVGRectElement, unknown, null, undefined>;
  public gContent!: Selection<SVGGElement, unknown, null, undefined>;
  public rContent!: Selection<SVGRectElement, unknown, null, undefined>;
  public gChart!: Selection<SVGGElement, unknown, null, undefined>;

  public axisLeft = new AxisLayout();
  public axisRight = new AxisLayout();

  initializeBase(refs: {
    gSection: ElementRef<SVGGElement>;
    rSection: ElementRef<SVGRectElement>;
    gContent: ElementRef<SVGGElement>;
    rContent: ElementRef<SVGRectElement>;
    gChart: ElementRef<SVGGElement>;

    axisLeft: AxisLayoutRefs;
    axisRight: AxisLayoutRefs;
  }, chartName: string): void {
    this.gSection = select(refs.gSection.nativeElement);
    this.rSection = select(refs.rSection.nativeElement);
    this.gContent = select(refs.gContent.nativeElement);
    this.rContent = select(refs.rContent.nativeElement);
    this.gChart = select(refs.gChart.nativeElement);

    this.axisLeft.initialize(refs.axisLeft);
    this.axisRight.initialize(refs.axisRight);
  }
}
