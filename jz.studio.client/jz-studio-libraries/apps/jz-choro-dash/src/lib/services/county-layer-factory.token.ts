import { inject, InjectionToken } from '@angular/core';

import { CountyLayerFactory } from '../models/factories/county-layer-factory.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';

export const COUNTY_LAYER_FACTORY =
  new InjectionToken<CountyLayerFactory>(
    'CountyLayerFactory',
    {
      providedIn: 'root',
      factory: () => inject(CountyLayerFactoryService)
    }
  );
