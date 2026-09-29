import { inject, InjectionToken } from '@angular/core';

import { CountySelectionFactory } from '../models/factories/county-selection-factory.model';
import { CountySelectionFactoryService } from './county-selection-factory.service';

export const COUNTY_SELECTION_FACTORY =
  new InjectionToken<CountySelectionFactory>(
    'CountySelectionFactory',
    {
      providedIn: 'root',
      factory: () => inject(CountySelectionFactoryService)
    }
  );
