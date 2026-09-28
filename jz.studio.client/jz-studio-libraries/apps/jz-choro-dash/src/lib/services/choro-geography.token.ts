import { inject, InjectionToken } from '@angular/core';

import { ChoroGeography } from '../models/choro-geography.model';
import { ChoroGeographyService } from './choro-geography.service';

export const CHORO_GEOGRAPHY = new InjectionToken<ChoroGeography>(
  'ChoroGeography',
  {
    providedIn: 'root',
    factory: () => inject(ChoroGeographyService)
  }
);
