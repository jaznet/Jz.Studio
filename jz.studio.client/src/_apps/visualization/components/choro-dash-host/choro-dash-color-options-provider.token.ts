import { InjectionToken } from '@angular/core';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
export const CHORO_DASH_COLOR_OPTIONS_PROVIDER =
  new InjectionToken<ChoroDashColorOptionsProvider>(
    'ChoroDashColorOptionsProvider'
  );
