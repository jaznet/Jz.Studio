import { ChartType } from '../enums/chart-type';
import { Rect } from './common-interfaces';



export interface PanelDefinition {
  id: string;
  chartType: ChartType;
  ratio: number;
  showAxisLeft?: boolean;
  showAxisRight?: boolean;
  showXAxisTop?: boolean;
  showXAxisBottom?: boolean;
  visible?: boolean;
  order?: number;
  showTitle?: boolean;
}

export interface PanelRenderRectangles {
  panelRect: Rect;
  titleRect: Rect;
  axisTopRect: Rect;
  axisBottomRect: Rect;
  axisLeftRect: Rect;
  axisRightRect: Rect;
  contentRect: Rect;
}

export interface PanelViewModel {
  id: string;
  chartType: ChartType;
  order: number;
  visible: boolean;

  bounds: Rect;
  innerWidth: number;
  innerHeight: number;

  rects: PanelRenderRectangles;
}

/**
 * Transitional legacy shape.
 * Remove once older layout/rendering code is migrated to PanelViewModel.
 */
export interface PanelAttributes {
  id: string;
  index: number;
  panelRect: Rect;
  titleRect: Rect;
  axisLeftRect: Rect;
  axisRightRect: Rect;
  axisTopRect: Rect;
  axisBottomRect: Rect;
  contentRect: Rect;
  innerWidth: number;
  innerHeight: number;
}

export interface PanelWorkspaceItem {
  id: string;
  order: number;
  visible: boolean;
  rect: Rect;
  headerRect?: Rect;
  bodyRect: Rect;
}
