import { inject, InjectionToken } from '@angular/core';

import { CountyColorResolverFactory } from '../../models/factories/county-color-resolver-factory.model';
import { MetricCountyColorResolverFactoryService } from './metric-county-color-resolver-factory.service';

export const COUNTY_COLOR_RESOLVER_FACTORY =
  new InjectionToken<CountyColorResolverFactory>(
    'CountyColorResolverFactory',
    {
      providedIn: 'root',
      factory: () => inject(MetricCountyColorResolverFactoryService)
    }
  );
