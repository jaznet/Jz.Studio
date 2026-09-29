import { inject, InjectionToken } from '@angular/core';

import { CountySelectionGestureBinder } from '../models/county-selection-gesture-binder.model';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';

export const COUNTY_SELECTION_GESTURE_BINDER =
  new InjectionToken<CountySelectionGestureBinder>(
    'CountySelectionGestureBinder',
    {
      providedIn: 'root',
      factory: () => inject(CountySelectionGestureBinderService)
    }
  );
