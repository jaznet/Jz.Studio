import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';

import { JzChoroDashComponent } from 'jz-choro-dash';

import {
  ChoroDashColorOptionsProvider
} from './choro-dash-color-options-provider.model';
import {
  CHORO_DASH_COLOR_OPTIONS_PROVIDER
} from './choro-dash-color-options-provider.token';
import { ChoroDashLoadState } from './choro-dash-load-state.model';
import { CHORO_DASH_HOST_PROVIDERS } from './choro-dash-host.providers';

@Component({
  selector: 'choro-dash-host',
  standalone: true,
  imports: [AsyncPipe, JzChoroDashComponent],
  providers: CHORO_DASH_HOST_PROVIDERS,
  template: `
    @if (loadState$ | async; as state) {
      @if (state.options; as colorOptions) {
        <jz-choro-dash [colorResolverOptions]="colorOptions"
                       [countyValues]="colorOptions.values"
                       metricLabel="Median age (years)"
                       (adminRequested)="openAdmin()">
        </jz-choro-dash>
      } @else if (state.empty) {
        <div role="status">
          <p>{{ state.empty }}</p>
          <button type="button" (click)="retry()">Retry</button>
        </div>
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
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(CHORO_DASH_COLOR_OPTIONS_PROVIDER)
    colorOptionsProvider: ChoroDashColorOptionsProvider
  ) {
    this.loadState$ = this.loadRequests.pipe(
      switchMap(() => colorOptionsProvider.load().pipe(
        map((options): ChoroDashLoadState =>
          options.values?.length
            ? { options }
            : { empty: 'No county median-age data is available for the configured year.' }
        ),
        catchError(() => of<ChoroDashLoadState>({
          error: 'Unable to load county median ages. Check the API connection and retry.'
        })),
        startWith({} as ChoroDashLoadState)
      )),
      // Share one active load and its latest state across host subscribers.
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  openAdmin(): void {
    this.router.navigate(
      ['admin'],
      { relativeTo: this.route }
    );
  }

  retry(): void {
    this.loadRequests.next();
  }
}
