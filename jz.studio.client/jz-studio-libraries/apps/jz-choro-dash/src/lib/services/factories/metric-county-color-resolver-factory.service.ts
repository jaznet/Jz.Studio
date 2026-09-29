import { Injectable } from '@angular/core';

import {
  CountyColorResolverFactory,
  CountyColorResolverFactoryOptions
} from '../../models/factories/county-color-resolver-factory.model';
import { CountyColorResolver } from '../../models/county-color-resolver.model';
import { ThresholdCountyColorScale } from '../../paint-factory/color-scales/threshold-county-color-scale';
import { IndexedCountyMetricLookup } from '../../paint-factory/data/indexed-county-metric-lookup';
import { MetricCountyColorResolver } from '../../paint-factory/strategies/metric-county-color-resolver';

@Injectable({
  providedIn: 'root'
})
export class MetricCountyColorResolverFactoryService
  implements CountyColorResolverFactory {

  create(options: CountyColorResolverFactoryOptions): CountyColorResolver {
    const metricLookup = new IndexedCountyMetricLookup(options.values);
    const colorScale = new ThresholdCountyColorScale(options.stops);

    return new MetricCountyColorResolver(
      metricLookup,
      colorScale,
      options.missingValueColor
    );
  }
}
