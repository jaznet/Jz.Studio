import { CountyFeature } from './county-feature.model';

export type CountySelectionGesture = 'click' | 'primary-pointer';

export interface CountyLayerRenderOptions {
  countyLayer: any;
  countyFeaturesCollection: any;
  pathClass: string;
  gesture: CountySelectionGesture;
  onCountySelected: (countyFeature: CountyFeature) => void;
  includeTitle?: boolean;
}
