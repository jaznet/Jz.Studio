import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CountyMetricValue } from 'jz-choro-dash';

import { ChoroDashCountyValuesProvider } from './choro-dash-county-values-provider.model';
import { CHORO_DASH_COUNTY_API_CONFIG } from './choro-dash-county-api.config';

@Injectable()
export class ChoroDashApiCountyValuesService
  implements ChoroDashCountyValuesProvider {

  private readonly http = inject(HttpClient);
  private readonly config = inject(CHORO_DASH_COUNTY_API_CONFIG);

  load(): Observable<readonly CountyMetricValue[]> {
    return this.http.get<readonly CountyMetricValue[]>(
      this.config.medianAgeUrl,
      { params: { year: this.config.year } }
    );
  }
}
