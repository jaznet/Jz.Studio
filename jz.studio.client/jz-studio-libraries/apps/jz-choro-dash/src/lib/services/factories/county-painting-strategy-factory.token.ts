import { inject, InjectionToken } from '@angular/core';

import { CountyPaintingStrategyFactory } from '../../models/factories/county-painting-strategy-factory.model';
import { CountyPaintingStrategyFactoryService } from './county-painting-strategy-factory.service';

export const COUNTY_PAINTING_STRATEGY_FACTORY =
  new InjectionToken<CountyPaintingStrategyFactory>(
    'CountyPaintingStrategyFactory',
    {
      providedIn: 'root',
      factory: () => inject(CountyPaintingStrategyFactoryService)
    }
  );
