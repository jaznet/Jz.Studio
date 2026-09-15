// geo-shape-set.model.ts

import type {
  Feature,
  FeatureCollection,
  Geometry
} from 'geojson';

export interface GeoShapeSet {
  features: FeatureCollection;
  detailFeatures?: FeatureCollection;
  mesh?: any;
  outline?: any;
  selectedFeature?: any;
}
