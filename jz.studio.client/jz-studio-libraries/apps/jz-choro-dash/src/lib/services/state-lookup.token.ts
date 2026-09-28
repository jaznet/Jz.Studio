import { inject, InjectionToken } from '@angular/core';

import { StateLookupCatalog } from '../interfaces/state-lookup';
import { StateLookupService } from './state-lookup.service';

export const STATE_LOOKUP = new InjectionToken<StateLookupCatalog>(
  'StateLookupCatalog',
  {
    providedIn: 'root',
    factory: () => inject(StateLookupService)
  }
);
