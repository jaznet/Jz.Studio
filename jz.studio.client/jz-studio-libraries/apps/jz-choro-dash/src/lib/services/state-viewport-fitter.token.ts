import { inject, InjectionToken } from '@angular/core';

import { StateViewportFitter } from '../models/state-viewport-fitter.model';
import { StateViewportFitterService } from './state-viewport-fitter.service';

export const STATE_VIEWPORT_FITTER =
  new InjectionToken<StateViewportFitter>(
    'StateViewportFitter',
    {
      providedIn: 'root',
      factory: () => inject(StateViewportFitterService)
    }
  );
