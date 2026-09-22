import { CountyFeatureCollection } from './county-feature.model';

export interface CountyLayerFactoryOptions {
  countyLayer: any;
  countyFeaturesCollection: CountyFeatureCollection;
  pathClass: string;
}

export interface CountyLayerFactory {
  create(options: CountyLayerFactoryOptions): any;
}
