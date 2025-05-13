import { ElementRef } from '@angular/core';
import { Selection, select } from 'd3-selection';

export class AxisLayout {
  gAxis!: Selection<SVGGElement, unknown, null, undefined>;
  gAxisGroup!: Selection<SVGGElement, unknown, null, undefined>;
  rAxisRect!: Selection<SVGRectElement, unknown, null, undefined>;

  initialize(refs: {
    gAxis: ElementRef<SVGGElement>;
    gAxisGroup: ElementRef<SVGGElement>;
    rAxisRect: ElementRef<SVGRectElement>;
  }): void {
    this.gAxis = select(refs.gAxis.nativeElement);
    this.gAxisGroup = select(refs.gAxisGroup.nativeElement);
    this.rAxisRect = select(refs.rAxisRect.nativeElement);
  }
}
