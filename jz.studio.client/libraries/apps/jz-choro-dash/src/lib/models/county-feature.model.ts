import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface CountyFeatureProperties {
  name?: string;
  [propertyName: string]: unknown;
}

export type CountyFeature = Feature<
  Geometry,
  CountyFeatureProperties | null
>;

export type CountyFeatureCollection = FeatureCollection<
  Geometry,
  CountyFeatureProperties | null
>;
