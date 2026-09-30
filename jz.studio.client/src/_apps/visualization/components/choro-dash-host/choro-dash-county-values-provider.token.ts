import { InjectionToken } from '@angular/core';

import {
  ChoroDashCountyValuesProvider
} from './choro-dash-county-values-provider.model';
export const CHORO_DASH_COUNTY_VALUES_PROVIDER =
  new InjectionToken<ChoroDashCountyValuesProvider>(
    'ChoroDashCountyValuesProvider'
  );
