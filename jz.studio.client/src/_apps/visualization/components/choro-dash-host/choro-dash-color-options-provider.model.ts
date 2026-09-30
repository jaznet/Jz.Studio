import { Observable } from 'rxjs';

import { CountyColorResolverFactoryOptions } from 'jz-choro-dash';

export interface ChoroDashColorOptionsProvider {
  load(): Observable<CountyColorResolverFactoryOptions>;
}
