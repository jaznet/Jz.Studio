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
  includeTitle?: boolean;
}
