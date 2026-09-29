import { CountyColorResolver } from '../county-color-resolver.model';
import { CountyColorStop } from '../county-color-scale.model';
import { CountyMetricValue } from '../county-metric-value.model';

export interface CountyColorResolverFactoryOptions {
  values: readonly CountyMetricValue[];
  stops: readonly CountyColorStop[];
  missingValueColor: string;
}

export interface CountyColorResolverFactory {
  create(options: CountyColorResolverFactoryOptions): CountyColorResolver;
}
