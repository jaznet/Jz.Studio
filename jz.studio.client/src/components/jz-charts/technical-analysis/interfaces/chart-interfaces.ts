import { Rect } from "./common-interfaces";

export interface ChartViewportLayout {
  frameRect: Rect;
  contentRect: Rect;
  axisLeftRect?: Rect;
  axisRightRect?: Rect;
  axisTopRect?: Rect;
  axisBottomRect?: Rect;
}
