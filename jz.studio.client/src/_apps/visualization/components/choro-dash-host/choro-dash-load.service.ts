import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';

import { ChoroDashColorOptionsProvider } from './choro-dash-color-options-provider.model';
import { CHORO_DASH_COLOR_OPTIONS_PROVIDER } from './choro-dash-color-options-provider.token';
import { ChoroDashLoadState } from './choro-dash-load-state.model';

@Injectable()
export class ChoroDashLoadService {
  private readonly loadRequests = new BehaviorSubject<void>(undefined);

  readonly loadState$: Observable<ChoroDashLoadState>;

  constructor(
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

  retry(): void {
    this.loadRequests.next();
  }
}
