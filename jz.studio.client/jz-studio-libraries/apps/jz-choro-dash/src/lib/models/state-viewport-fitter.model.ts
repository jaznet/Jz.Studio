import {
  SvgCanvasSelection,
  SvgGroupSelection
} from './svg-layer-selection.model';

export interface StateViewportFitContext {
  svg: SvgCanvasSelection;
  outerGroup: SvgGroupSelection;
  stateGroup: SvgGroupSelection;
  stateId: string | null;
  width: number;
  height: number;
}

export interface StateViewportFitter {
  fit(context: StateViewportFitContext): void;
}
