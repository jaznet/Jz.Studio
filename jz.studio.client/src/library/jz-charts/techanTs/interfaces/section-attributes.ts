import { Margins, RectDimensions } from "./techan-interfaces";

export interface SectionAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  margins: Margins;
  content: RectDimensions|null;
  fill?: string;
  spacer: number;
  pct: number;
}
