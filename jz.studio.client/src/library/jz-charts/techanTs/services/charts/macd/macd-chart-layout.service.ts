import { ElementRef, Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class MacdChartLayoutService {
  gMacdSection!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdSectionRect!: Selection<SVGRectElement, unknown, null, undefined>;
  gMacdContent!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdContentRect!: Selection<SVGRectElement, unknown, null, undefined>;
  gMacdChart!: Selection<SVGGElement, unknown, null, undefined>;

  gMacdAxisLeft!: Selection<SVGGElement, unknown, null, undefined>;
  gMacdAxisGroupLeft!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdAxisRectLeft!: Selection<SVGRectElement, unknown, null, undefined>;

  gMacdAxisRight!: Selection<SVGGElement, unknown, null, undefined>;
  gMacdAxisGroupRight!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdAxisRectRight!: Selection<SVGRectElement, unknown, null, undefined>;

  initializeSelections(refs: {
    gMacdSection: ElementRef<SVGGElement>;
    rMacdSectionRect: ElementRef<SVGRectElement>;
    gMacdContent: ElementRef<SVGGElement>;
    rMacdContentRect: ElementRef<SVGRectElement>;
    gMacdChart: ElementRef<SVGGElement>;

    gMacdAxisLeft: ElementRef<SVGGElement>;
    gMacdAxisGroupLeft: ElementRef<SVGGElement>;
    rMacdAxisRectLeft: ElementRef<SVGRectElement>;

    gMacdAxisRight: ElementRef<SVGGElement>;
    gMacdAxisGroupRight: ElementRef<SVGGElement>;
    rMacdAxisRectRight: ElementRef<SVGRectElement>;
  }): void {
    this.gMacdSection = select(refs.gMacdSection.nativeElement);
    this.rMacdSectionRect = select(refs.rMacdSectionRect.nativeElement);
    this.gMacdContent = select(refs.gMacdContent.nativeElement);
    this.rMacdContentRect = select(refs.rMacdContentRect.nativeElement);
    this.gMacdChart = select(refs.gMacdChart.nativeElement);

    this.gMacdAxisLeft = select(refs.gMacdAxisLeft.nativeElement);
    this.gMacdAxisGroupLeft = select(refs.gMacdAxisGroupLeft.nativeElement);
    this.rMacdAxisRectLeft = select(refs.rMacdAxisRectLeft.nativeElement);

    this.gMacdAxisRight = select(refs.gMacdAxisRight.nativeElement);
    this.gMacdAxisGroupRight = select(refs.gMacdAxisGroupRight.nativeElement);
    this.rMacdAxisRectRight = select(refs.rMacdAxisRectRight.nativeElement);
  }
}
