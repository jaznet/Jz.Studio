import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CountyColorResolverFactoryOptions } from 'jz-choro-dash';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  CHORO_DASH_COUNTY_COLOR_STOPS,
  CHORO_DASH_MISSING_VALUE_COLOR
} from './choro-dash-color-scale.config';
import {
  CHORO_DASH_DEMO_COUNTY_VALUES
} from './choro-dash-demo-county-values';

@Injectable({
  providedIn: 'root'
})
export class ChoroDashDemoColorOptionsService
  implements ChoroDashColorOptionsProvider {

  load(): Observable<CountyColorResolverFactoryOptions> {
    return of({
      values: CHORO_DASH_DEMO_COUNTY_VALUES,
      stops: CHORO_DASH_COUNTY_COLOR_STOPS,
      missingValueColor: CHORO_DASH_MISSING_VALUE_COLOR
    });
  }
}
