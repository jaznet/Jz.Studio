import { ElementRef, Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { BaseChartLayoutService } from '../base-chart-layout-service';

@Injectable({ providedIn: 'root' })
export class MacdChartLayoutService extends BaseChartLayoutService {

  initializeSelections(refs: {
    gSection: ElementRef<SVGGElement>;
    rSectionRect: ElementRef<SVGRectElement>;
    gContent: ElementRef<SVGGElement>;
    rContentRect: ElementRef<SVGRectElement>;
    gChart: ElementRef<SVGGElement>;

    gAxisLeft: ElementRef<SVGGElement>;
    gAxisGroupLeft: ElementRef<SVGGElement>;
    rAxisRectLeft: ElementRef<SVGRectElement>;

    gAxisRight: ElementRef<SVGGElement>;
    gAxisGroupRight: ElementRef<SVGGElement>;
    rAxisRectRight: ElementRef<SVGRectElement>;
  }): void {
    this.gSection = select(refs.gSection.nativeElement);
    this.rSection = select(refs.rSectionRect.nativeElement);
    this.gContent = select(refs.gContent.nativeElement);
    this.rContent = select(refs.rContentRect.nativeElement);
    this.gChart = select(refs.gChart.nativeElement);

    this.gAxisLeft = select(refs.gAxisLeft.nativeElement);
    this.gAxisGroupLeft = select(refs.gAxisGroupLeft.nativeElement);
    this.rAxisLeft = select(refs.rAxisRectLeft.nativeElement);

    this.gAxisRight = select(refs.gAxisRight.nativeElement);
    this.gAxisGroupRight = select(refs.gAxisGroupRight.nativeElement);
    this.rAxisRight = select(refs.rAxisRectRight.nativeElement);
  }
}
