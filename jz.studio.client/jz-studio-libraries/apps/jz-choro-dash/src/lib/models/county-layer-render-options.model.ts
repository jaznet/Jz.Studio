import { CountyColorResolver } from './county-color-resolver.model';
import {
  CountyFeature,
  CountyFeatureCollection
} from './county-feature.model';

export type CountySelectionGesture = 'click' | 'primary-pointer';

export interface CountyLayerRenderOptions {
  countyLayer: any;
  countyFeaturesCollection: CountyFeatureCollection;
  pathClass: string;
  gesture: CountySelectionGesture;
  onCountySelected: (countyFeature: CountyFeature) => void;
  colorResolver?: CountyColorResolver;
  includeTitle?: boolean;
}
