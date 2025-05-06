import { Selection, select } from 'd3-selection';

export abstract class BaseChartLayoutService {
  gSection!: Selection<SVGGElement, unknown, null, undefined>;
  rSection!: Selection<SVGRectElement, unknown, null, undefined>;
  gContent!: Selection<SVGGElement, unknown, null, undefined>;
  rContent!: Selection<SVGRectElement, unknown, null, undefined>;
  gChart!: Selection<SVGGElement, unknown, null, undefined>;
  rChart!: Selection<SVGRectElement, unknown, null, undefined>;

  gAxisLeft!: Selection<SVGGElement, unknown, null, undefined>;
  gAxisGroupLeft!: Selection<SVGGElement, unknown, null, undefined>;
  rAxisRectLeft!: Selection<SVGRectElement, unknown, null, undefined>;

  gAxisRight!: Selection<SVGGElement, unknown, null, undefined>;
  gAxisGroupRight!: Selection<SVGGElement, unknown, null, undefined>;
  rAxisRectRight!: Selection<SVGRectElement, unknown, null, undefined>;
}
