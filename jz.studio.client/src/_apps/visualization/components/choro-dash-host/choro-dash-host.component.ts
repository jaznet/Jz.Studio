import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CountyColorResolverFactoryOptions,
  JzChoroDashComponent
} from 'jz-choro-dash';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  CHORO_DASH_COLOR_OPTIONS_PROVIDER
} from './choro-dash-color-options-provider.token';
import {
  ChoroDashColorOptionsService
} from './choro-dash-color-options.service';
import {
  CHORO_DASH_COUNTY_VALUES_PROVIDER
} from './choro-dash-county-values-provider.token';
import {
  ChoroDashDemoCountyValuesService
} from './choro-dash-demo-county-values.service';

@Component({
  selector: 'choro-dash-host',
  standalone: true,
  imports: [AsyncPipe, JzChoroDashComponent],
  providers: [
    ChoroDashColorOptionsService,
    ChoroDashDemoCountyValuesService,
    {
      provide: CHORO_DASH_COLOR_OPTIONS_PROVIDER,
      useExisting: ChoroDashColorOptionsService
    },
    {
      provide: CHORO_DASH_COUNTY_VALUES_PROVIDER,
      useExisting: ChoroDashDemoCountyValuesService
    }
  ],
  template: `
    @if (colorOptions$ | async; as colorOptions) {
      <jz-choro-dash
        [colorResolverOptions]="colorOptions">
      </jz-choro-dash>
    }
  `,
  styles: [`
    :host,
    jz-choro-dash {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }
  `]
})
export class ChoroDashHostComponent {
  @HostBinding('class') classes = 'fit-to-parent';

  readonly colorOptions$: Observable<CountyColorResolverFactoryOptions>;

  constructor(
    @Inject(CHORO_DASH_COLOR_OPTIONS_PROVIDER)
    colorOptionsProvider: ChoroDashColorOptionsProvider
  ) {
    this.colorOptions$ = colorOptionsProvider.load();
  }
}
