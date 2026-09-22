import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry
} from 'geojson';

export type StateFeature = Feature<Geometry, GeoJsonProperties>;

export type StateFeatureCollection = FeatureCollection<
  Geometry,
  GeoJsonProperties
>;
