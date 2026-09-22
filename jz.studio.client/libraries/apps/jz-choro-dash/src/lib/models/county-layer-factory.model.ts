import { Selection } from 'd3-selection';

import {
  CountyFeature,
  CountyFeatureCollection
} from './county-feature.model';

export type CountyLayerSelection = Selection<
  SVGGElement,
  unknown,
  null,
  undefined
>;

export type CountyPathSelection = Selection<
  SVGPathElement,
  CountyFeature,
  SVGGElement,
  unknown
>;

export interface CountyLayerFactoryOptions {
  countyLayer: CountyLayerSelection;
  countyFeaturesCollection: CountyFeatureCollection;
  pathClass: string;
}

export interface CountyLayerFactory {
  create(options: CountyLayerFactoryOptions): CountyPathSelection;
}
