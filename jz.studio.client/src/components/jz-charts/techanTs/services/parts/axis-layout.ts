import { ElementRef } from '@angular/core';
import { select, Selection } from 'd3-selection';

export type AxisLayoutRefs = {
  gAxis: ElementRef<SVGGElement>;
  rAxis: ElementRef<SVGRectElement>;
  gAxisGroup: ElementRef<SVGGElement>;
};

export class AxisLayout {
  gAxis!: Selection<SVGGElement, unknown, null, undefined>;
  rAxis!: Selection<SVGRectElement, unknown, null, undefined>;
  gAxisGroup!: Selection<SVGGElement, unknown, null, undefined>;

  initialize(refs: AxisLayoutRefs): void {
    this.gAxis = select(refs.gAxis.nativeElement);
    this.rAxis = select(refs.rAxis.nativeElement);
    this.gAxisGroup = select(refs.gAxisGroup.nativeElement);
  }

  call(generator: any): void {
    this.gAxis.call(generator);
  }
}
