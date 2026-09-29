import { StateCentroidMode } from './state-centroid-mode.model';
import { StateFeatureCollection } from './state-feature.model';
import { SvgGroupSelection } from './svg-layer-selection.model';

export interface StateCentroidRenderer {
  render(
    usaLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection
  ): void;

  applyDisplay(
    usaLayer: SvgGroupSelection,
    showCentroids: boolean,
    centroidMode: StateCentroidMode
  ): void;
}
