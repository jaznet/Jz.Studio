import { ChartType } from '../enums/chart-type';
import { DivRect } from './common-interfaces';



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
  panelRect: DivRect;
  titleRect: DivRect;
  axisTopRect: DivRect;
  axisBottomRect: DivRect;
  axisLeftRect: DivRect;
  axisRightRect: DivRect;
  contentRect: DivRect;
}

export interface PanelViewModel {
  id: string;
  chartType: ChartType;
  order: number;
  visible: boolean;

  bounds: DivRect;
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
  showAxisLeft: boolean;
  showAxisRight: boolean;
  panelRect: DivRect;
  titleRect: DivRect;
  axisLeftRect: DivRect;
  axisRightRect: DivRect;
  axisTopRect: DivRect;
  axisBottomRect: DivRect;
  contentRect: DivRect;
  innerWidth: number;
  innerHeight: number;
}

export interface PanelWorkspaceItem {
  id: string;
  order: number;
  visible: boolean;
  rect: DivRect;
  headerRect?: DivRect;
  bodyRect: DivRect;
}
