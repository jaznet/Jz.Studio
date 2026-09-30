import { inject, InjectionToken } from '@angular/core';

import {
  ChoroDashCountyValuesProvider
} from './choro-dash-county-values-provider.model';
import {
  ChoroDashDemoCountyValuesService
} from './choro-dash-demo-county-values.service';

export const CHORO_DASH_COUNTY_VALUES_PROVIDER =
  new InjectionToken<ChoroDashCountyValuesProvider>(
    'ChoroDashCountyValuesProvider',
    {
      providedIn: 'root',
      factory: () => inject(ChoroDashDemoCountyValuesService)
    }
  );
