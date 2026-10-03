import { AsyncPipe } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { JzChoroDashComponent } from 'jz-choro-dash';

import { ChoroDashLoadStatusComponent } from './choro-dash-load-status.component';
import { ChoroDashLoadService } from './choro-dash-load.service';
import { ChoroDashLoadState } from './choro-dash-load-state.model';
import { CHORO_DASH_HOST_PROVIDERS } from './choro-dash-host.providers';

@Component({
  selector: 'choro-dash-host',
  standalone: true,
  imports: [AsyncPipe, JzChoroDashComponent, ChoroDashLoadStatusComponent],
  providers: CHORO_DASH_HOST_PROVIDERS,
  template: `
    @if (loadState$ | async; as state) {
      @if (state.options; as colorOptions) {
        <jz-choro-dash [colorResolverOptions]="colorOptions"
                       [countyValues]="colorOptions.values"
                       metricLabel="Median age (years)"
                       (adminRequested)="openAdmin()">
        </jz-choro-dash>
      } @else {
        <choro-dash-load-status [empty]="state.empty"
                                [error]="state.error"
                                (retryRequested)="retry()">
        </choro-dash-load-status>
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

  readonly loadState$: Observable<ChoroDashLoadState>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly loadService: ChoroDashLoadService
  ) {
    this.loadState$ = loadService.loadState$;
  }

  openAdmin(): void {
    this.router.navigate(
      ['admin'],
      { relativeTo: this.route }
    );
  }

  retry(): void {
    this.loadService.retry();
  }
}
