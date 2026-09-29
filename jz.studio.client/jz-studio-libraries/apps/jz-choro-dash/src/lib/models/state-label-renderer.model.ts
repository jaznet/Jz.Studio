import { SvgGroupSelection } from './svg-layer-selection.model';
import { StateFeatureCollection } from './state-feature.model';

export interface StateLabelRenderer {
  render(
    stateTextLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection
  ): void;
}
