import { CountyFeature } from './county-feature.model';
import { CountyPathSelection } from './factories/county-layer-factory.model';
import { CountySelectionGesture } from './county-layer-render-options.model';

export interface CountySelectionGestureBinder {
  bind(
    countyPaths: CountyPathSelection,
    gesture: CountySelectionGesture,
    onCountySelected: (countyFeature: CountyFeature) => void
  ): void;
}
