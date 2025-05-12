import { ElementRef, Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { BaseChartLayoutService } from '../base-chart-layout-service';

@Injectable({ providedIn: 'root' })
export class OhlcChartLayoutService extends BaseChartLayoutService  {
  gOhlcSection!: Selection<SVGGElement, unknown, null, undefined>;
  rOhlcSectionRect!: Selection<SVGRectElement, unknown, null, undefined>;
  gOhlcContent!: Selection<SVGGElement, unknown, null, undefined>;
  rOhlcContentRect!: Selection<SVGRectElement, unknown, null, undefined>;
  gOhlcChart!: Selection<SVGGElement, unknown, null, undefined>;

  gOhlcAxisLeft!: Selection<SVGGElement, unknown, null, undefined>;
  gOhlcAxisGroupLeft!: Selection<SVGGElement, unknown, null, undefined>;
  rOhlcAxisRectLeft!: Selection<SVGRectElement, unknown, null, undefined>;

  gOhlcAxisRight!: Selection<SVGGElement, unknown, null, undefined>;
  gOhlcAxisGroupRight!: Selection<SVGGElement, unknown, null, undefined>;
  rOhlcAxisRectRight!: Selection<SVGRectElement, unknown, null, undefined>;

  initializeSelections(refs: {
    gSection: ElementRef<SVGGElement>;
    rSection: ElementRef<SVGRectElement>;
    gContent: ElementRef<SVGGElement>;
    rContent: ElementRef<SVGRectElement>;
    gChart: ElementRef<SVGGElement>;

    gAxisLeft: ElementRef<SVGGElement>;
    gAxisGroupLeft: ElementRef<SVGGElement>;
    rAxisRectLeft: ElementRef<SVGRectElement>;

    gAxisRight: ElementRef<SVGGElement>;
    gAxisGroupRight: ElementRef<SVGGElement>;
    rAxisRectRight: ElementRef<SVGRectElement>;
  }): void {
    this.gSection = select(refs.gSection.nativeElement);
    this.rSection = select(refs.rSection.nativeElement);
    this.gContent = select(refs.gContent.nativeElement);
    this.rContent = select(refs.rContent.nativeElement);
    this.gChart = select(refs.gChart.nativeElement);

    this.gAxisLeft = select(refs.gAxisLeft.nativeElement);
    this.gAxisGroupLeft = select(refs.gAxisGroupLeft.nativeElement);
    this.rAxisLeft = select(refs.rAxisRectLeft.nativeElement);

    this.gAxisRight = select(refs.gAxisRight.nativeElement);
    this.gAxisGroupRight = select(refs.gAxisGroupRight.nativeElement);
    this.rAxisRight = select(refs.rAxisRectRight.nativeElement);
  }
}
