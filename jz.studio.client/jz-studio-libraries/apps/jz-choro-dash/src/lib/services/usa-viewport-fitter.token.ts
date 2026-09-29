import { inject, InjectionToken } from '@angular/core';

import { UsaViewportFitter } from '../models/usa-viewport-fitter.model';
import { UsaViewportFitterService } from './usa-viewport-fitter.service';

export const USA_VIEWPORT_FITTER =
  new InjectionToken<UsaViewportFitter>(
    'UsaViewportFitter',
    {
      providedIn: 'root',
      factory: () => inject(UsaViewportFitterService)
    }
  );
