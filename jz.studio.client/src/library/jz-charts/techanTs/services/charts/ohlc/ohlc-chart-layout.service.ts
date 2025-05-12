import { ElementRef, Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class OhlcChartLayoutService {
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
    gOhlcSection: ElementRef<SVGGElement>;
    rOhlcSectionRect: ElementRef<SVGRectElement>;
    gOhlcContent: ElementRef<SVGGElement>;
    rOhlcContentRect: ElementRef<SVGRectElement>;
    gOhlcChart: ElementRef<SVGGElement>;

    gOhlcAxisLeft: ElementRef<SVGGElement>;
    gOhlcAxisGroupLeft: ElementRef<SVGGElement>;
    rOhlcAxisRectLeft: ElementRef<SVGRectElement>;

    gOhlcAxisRight: ElementRef<SVGGElement>;
    gOhlcAxisGroupRight: ElementRef<SVGGElement>;
    rOhlcAxisRectRight: ElementRef<SVGRectElement>;
  }): void {
    this.gOhlcSection = select(refs.gOhlcSection.nativeElement);
    this.rOhlcSectionRect = select(refs.rOhlcSectionRect.nativeElement);
    this.gOhlcContent = select(refs.gOhlcContent.nativeElement);
    this.rOhlcContentRect = select(refs.rOhlcContentRect.nativeElement);
    this.gOhlcChart = select(refs.gOhlcChart.nativeElement);

    this.gOhlcAxisLeft = select(refs.gOhlcAxisLeft.nativeElement);
    this.gOhlcAxisGroupLeft = select(refs.gOhlcAxisGroupLeft.nativeElement);
    this.rOhlcAxisRectLeft = select(refs.rOhlcAxisRectLeft.nativeElement);

    this.gOhlcAxisRight = select(refs.gOhlcAxisRight.nativeElement);
    this.gOhlcAxisGroupRight = select(refs.gOhlcAxisGroupRight.nativeElement);
    this.rOhlcAxisRectRight = select(refs.rOhlcAxisRectRight.nativeElement);
  }
}
