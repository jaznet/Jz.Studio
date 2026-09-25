import { CountyLayerSelection } from './county-layer-factory.model';
import {
  SvgCanvasSelection,
  SvgGroupSelection
} from './svg-layer-selection.model';

export interface UsaLayerSet {
  svg: SvgCanvasSelection;
  usaLayer: SvgGroupSelection;
  countyLayer: CountyLayerSelection;
  stateLayer: SvgGroupSelection;
  nationLayer: SvgGroupSelection;
  stateTextLayer: SvgGroupSelection;
}
