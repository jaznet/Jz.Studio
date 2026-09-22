export interface CountyFeatureProperties {
  name?: string;
  [propertyName: string]: unknown;
}

export interface CountyFeature {
  id: string | number;
  properties?: CountyFeatureProperties;
  [featureProperty: string]: unknown;
}
