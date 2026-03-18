import { ChartType } from '../enums/chart-type';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PanelAttributes {
  chartType: ChartType;

  /** Full panel area (including axes + margins) */
  bounds: Rect;

  /** Drawable content area (inside margins & axes) */
  content: Rect;

  /** Axis regions */
  axisLeft: Rect;
  axisRight: Rect;

  /** Optional top/bottom axis areas (for shared x-axis scenarios) */
  axisTop?: Rect;
  axisBottom?: Rect;

  /** Layout ratio (used by layout engine) */
  ratio?: number;

  /** Index/order in panel stack */
  order?: number;
}
