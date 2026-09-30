import { Observable } from 'rxjs';

import { CountyMetricValue } from 'jz-choro-dash';

export interface ChoroDashCountyValuesProvider {
  load(): Observable<readonly CountyMetricValue[]>;
}
