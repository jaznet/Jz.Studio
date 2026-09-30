import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CountyMetricValue } from 'jz-choro-dash';

import {
  ChoroDashCountyValuesProvider
} from './choro-dash-county-values-provider.model';
import {
  CHORO_DASH_DEMO_COUNTY_VALUES
} from './choro-dash-demo-county-values';

@Injectable({
  providedIn: 'root'
})
export class ChoroDashDemoCountyValuesService
  implements ChoroDashCountyValuesProvider {

  load(): Observable<readonly CountyMetricValue[]> {
    return of(CHORO_DASH_DEMO_COUNTY_VALUES);
  }
}
