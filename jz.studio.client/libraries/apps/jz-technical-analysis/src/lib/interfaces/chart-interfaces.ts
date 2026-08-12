import { DivRect } from "./common-interfaces";

export interface ChartViewportLayout {
  frameRect: DivRect;
  contentRect: DivRect;
  axisLeftRect?: DivRect;
  axisRightRect?: DivRect;
  axisTopRect?: DivRect;
  axisBottomRect?: DivRect;
}

export interface ChartFrame {
  outerRect: DivRect;
  contentRect: DivRect;
  axisLeftRect?: DivRect;
  axisRightRect?: DivRect;
  axisTopRect?: DivRect;
  axisBottomRect?: DivRect;
}
