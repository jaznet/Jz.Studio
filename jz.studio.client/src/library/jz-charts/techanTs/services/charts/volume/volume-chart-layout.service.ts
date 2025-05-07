import { Injectable } from '@angular/core';
import { select, Selection } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class VolumeChartLayoutService {
  // High-level sections
  gSection!: Selection<SVGGElement, unknown, null, undefined>;
  rSectionRect!: Selection<SVGRectElement, unknown, null, undefined>;

  // Chart-specific content groupings
  gContent!: Selection<SVGGElement, unknown, null, undefined>;
  rContentRect!: Selection<SVGRectElement, unknown, null, undefined>;

  // Axis containers
  gXAxis!: Selection<SVGGElement, unknown, null, undefined>;

  /**
   * Initializes required SVG D3 selections.
   * @param selections - Object with keys for section, content, and axis.
   */
  initializeSelections(selections: {
    gSection: SVGGElement;
    rSectionRect: SVGRectElement;
    gContent: SVGGElement;
    rContentRect: SVGRectElement;
    gXAxis: SVGGElement;
  }): void {
    this.gSection = select(selections.gSection);
    this.rSectionRect = select(selections.rSectionRect);
    this.gContent = select(selections.gContent);
    this.rContentRect = select(selections.rContentRect);
    this.gXAxis = select(selections.gXAxis);
  }
}
