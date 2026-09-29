import { SvgGroupSelection } from './svg-layer-selection.model';
import {
  StateBoundaryGeometry,
  StateFeatureCollection
} from './state-feature.model';

export interface UsaBoundaryRenderer {
  render(
    stateLayer: SvgGroupSelection,
    nationLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection,
    stateMesh: StateBoundaryGeometry,
    nationMesh: StateBoundaryGeometry
  ): void;
}
