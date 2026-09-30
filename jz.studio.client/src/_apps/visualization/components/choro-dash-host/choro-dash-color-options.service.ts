import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CountyColorResolverFactoryOptions } from 'jz-choro-dash';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  CHORO_DASH_COUNTY_VALUES_PROVIDER
} from './choro-dash-county-values-provider.token';
import {
  CHORO_DASH_COUNTY_COLOR_STOPS,
  CHORO_DASH_MISSING_VALUE_COLOR
} from './choro-dash-color-scale.config';

@Injectable({
  providedIn: 'root'
})
export class ChoroDashColorOptionsService
  implements ChoroDashColorOptionsProvider {

  private readonly countyValuesProvider = inject(
    CHORO_DASH_COUNTY_VALUES_PROVIDER
  );

  load(): Observable<CountyColorResolverFactoryOptions> {
    return this.countyValuesProvider.load().pipe(
      map(values => ({
        values,
        stops: CHORO_DASH_COUNTY_COLOR_STOPS,
        missingValueColor: CHORO_DASH_MISSING_VALUE_COLOR
      }))
    );
  }
}
