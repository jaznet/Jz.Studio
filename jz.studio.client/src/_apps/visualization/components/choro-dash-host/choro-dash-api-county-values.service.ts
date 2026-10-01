import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CountyMetricValue } from 'jz-choro-dash';

import { ChoroDashCountyValuesProvider } from './choro-dash-county-values-provider.model';
import { CHORO_DASH_COUNTY_API_CONFIG } from './choro-dash-county-api.config';

import { parseCountyMetricValues } from './parse-county-metric-values';

@Injectable()
export class ChoroDashApiCountyValuesService
  implements ChoroDashCountyValuesProvider {

  private readonly http = inject(HttpClient);
  private readonly config = inject(CHORO_DASH_COUNTY_API_CONFIG);

  load(): Observable<readonly CountyMetricValue[]> {
    return this.http.get<unknown>(
      this.config.medianAgeUrl,
      { params: { year: this.config.year } }
    ).pipe(map(parseCountyMetricValues));
  }
}
