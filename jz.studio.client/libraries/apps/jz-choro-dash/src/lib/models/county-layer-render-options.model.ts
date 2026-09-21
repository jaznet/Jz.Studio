export type CountySelectionGesture = 'click' | 'primary-pointer';

export interface CountyLayerRenderOptions {
  countyLayer: any;
  countyFeaturesCollection: any;
  pathClass: string;
  gesture: CountySelectionGesture;
  onCountySelected: (countyFeature: any) => void;
  includeTitle?: boolean;
}
