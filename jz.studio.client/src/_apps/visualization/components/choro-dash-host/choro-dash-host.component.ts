import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';

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
  ChoroDashApiCountyValuesService
} from './choro-dash-api-county-values.service';

import {
  CHORO_DASH_COUNTY_API_CONFIG,
  CHORO_DASH_COUNTY_API_DEFAULTS
} from './choro-dash-county-api.config';

interface ChoroDashLoadState {
  readonly options?: CountyColorResolverFactoryOptions;
  readonly error?: string;
}

@Component({
  selector: 'choro-dash-host',
  standalone: true,
  imports: [AsyncPipe, JzChoroDashComponent],
  providers: [
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
  ],
  template: `
    @if (loadState$ | async; as state) {
      @if (state.options; as colorOptions) {
        <jz-choro-dash [colorResolverOptions]="colorOptions">
        </jz-choro-dash>
      } @else if (state.error) {
        <div role="alert">
          <p>{{ state.error }}</p>
          <button type="button" (click)="retry()">Retry</button>
        </div>
      } @else {
        <p role="status">Loading county median ages…</p>
      }
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

  private readonly loadRequests = new BehaviorSubject<void>(undefined);

  readonly loadState$: Observable<ChoroDashLoadState>;

  constructor(
    @Inject(CHORO_DASH_COLOR_OPTIONS_PROVIDER)
    colorOptionsProvider: ChoroDashColorOptionsProvider
  ) {
    this.loadState$ = this.loadRequests.pipe(
      switchMap(() => colorOptionsProvider.load().pipe(
        map(options => ({ options } as ChoroDashLoadState)),
        catchError(() => of<ChoroDashLoadState>({
          error: 'Unable to load county median ages. Check the API connection and retry.'
        })),
        startWith({} as ChoroDashLoadState)
      ))
    );
  }

  retry(): void {
    this.loadRequests.next();
  }
}
