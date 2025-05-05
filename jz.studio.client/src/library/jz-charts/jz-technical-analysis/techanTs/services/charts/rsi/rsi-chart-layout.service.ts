import { ElementRef, Injectable } from "@angular/core";
import { BaseChartLayoutService } from "../base-chart-layout-service";
import { Selection, select } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class RsiChartLayoutService extends BaseChartLayoutService {
  gGroup!: SVGGElement;
  yAxisLeftRectC!: SVGRectElement;
  yAxisRightRectC!: SVGRectElement;

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

    gGroup: ElementRef<SVGGElement>;
    yAxisLeftRectC: ElementRef<SVGRectElement>;
    yAxisRightRectC: ElementRef<SVGRectElement>;
  }): void {
    // Shared assignments
    this.gSection = select(refs.gSection.nativeElement);
    this.rSection = select(refs.rSectionRect.nativeElement);
    this.gContent = select(refs.gContent.nativeElement);
    this.rContent = select(refs.rContentRect.nativeElement);
    this.gChart = select(refs.gChart.nativeElement);

    this.gAxisLeft = select(refs.gAxisLeft.nativeElement);
    this.gAxisGroupLeft = select(refs.gAxisGroupLeft.nativeElement);
    this.rAxisRectLeft = select(refs.rAxisRectLeft.nativeElement);

    this.gAxisRight = select(refs.gAxisRight.nativeElement);
    this.gAxisGroupRight = select(refs.gAxisGroupRight.nativeElement);
    this.rAxisRectRight = select(refs.rAxisRectRight.nativeElement);

    // RSI-specific assignments
 //   this.gGroup = refs.gGroup.nativeElement;
    this.yAxisLeftRectC = refs.yAxisLeftRectC.nativeElement;
    this.yAxisRightRectC = refs.yAxisRightRectC.nativeElement;
  }
}
