import { inject, InjectionToken } from '@angular/core';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  ChoroDashColorOptionsService
} from './choro-dash-color-options.service';

export const CHORO_DASH_COLOR_OPTIONS_PROVIDER =
  new InjectionToken<ChoroDashColorOptionsProvider>(
    'ChoroDashColorOptionsProvider',
    {
      providedIn: 'root',
      factory: () => inject(ChoroDashColorOptionsService)
    }
  );
