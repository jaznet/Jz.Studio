import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CountyColorResolverFactoryOptions } from 'jz-choro-dash';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  CHORO_DASH_DEMO_COLOR_OPTIONS
} from './choro-dash-demo-color-options';

@Injectable({
  providedIn: 'root'
})
export class ChoroDashDemoColorOptionsService
  implements ChoroDashColorOptionsProvider {

  load(): Observable<CountyColorResolverFactoryOptions> {
    return of(CHORO_DASH_DEMO_COLOR_OPTIONS);
  }
}
