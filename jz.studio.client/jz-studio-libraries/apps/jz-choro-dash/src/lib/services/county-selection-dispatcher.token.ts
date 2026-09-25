import { inject, InjectionToken } from '@angular/core';

import { CountySelectionDispatcher } from '../models/county-selection-dispatcher.model';
import { CountySelectionDispatcherService } from './county-selection-dispatcher.service';

export const COUNTY_SELECTION_DISPATCHER =
  new InjectionToken<CountySelectionDispatcher>(
    'CountySelectionDispatcher',
    {
      providedIn: 'root',
      factory: () => inject(CountySelectionDispatcherService)
    }
  );
