// geo-shape-set.model.ts

import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface GeoShapeSet {
  features: FeatureCollection<Geometry>;
  mesh?: Geometry | null;
  selectedFeature?: Feature<Geometry> | null;
}
