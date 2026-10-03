import { Provider } from '@angular/core';
import { ChoroDashLoadService } from './choro-dash-load.service';
import { ChoroDashApiCountyValuesService } from './choro-dash-api-county-values.service';
import { CHORO_DASH_COLOR_OPTIONS_PROVIDER } from './choro-dash-color-options-provider.token';
import { ChoroDashColorOptionsService } from './choro-dash-color-options.service';
import {
  CHORO_DASH_COUNTY_API_CONFIG,
  CHORO_DASH_COUNTY_API_DEFAULTS
} from './choro-dash-county-api.config';
import { CHORO_DASH_COUNTY_VALUES_PROVIDER } from './choro-dash-county-values-provider.token';

export const CHORO_DASH_HOST_PROVIDERS: Provider[] = [
  ChoroDashLoadService,
  ChoroDashColorOptionsService,
  ChoroDashApiCountyValuesService,
  {
    provide: CHORO_DASH_COUNTY_API_CONFIG,
    useValue: CHORO_DASH_COUNTY_API_DEFAULTS
  },
  {
    provide: CHORO_DASH_COLOR_OPTIONS_PROVIDER,
    useExisting: ChoroDashColorOptionsService
  },
  {
    provide: CHORO_DASH_COUNTY_VALUES_PROVIDER,
    useExisting: ChoroDashApiCountyValuesService
  }
];
