// geo-shape-set.model.ts

import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface GeoShapeSet {
  features: FeatureCollection;
  mesh?: any;
  outline?: any;
  selectedFeature?: any;
}
