import { CountyLayerSelection } from './factories/county-layer-factory.model';
import {
  SvgCanvasSelection,
  SvgGroupSelection
} from './svg-layer-selection.model';

export interface StateLayerSet {
  svg: SvgCanvasSelection;
  outerGroup: SvgGroupSelection;
  titleLayer: SvgGroupSelection;
  stateLayer: SvgGroupSelection;
  countyLayer: CountyLayerSelection;
}
