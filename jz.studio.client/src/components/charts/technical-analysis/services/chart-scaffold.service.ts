// chart-scaffold.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartScaffold } from '../interfaces/chart-scafffold.interface';

@Injectable({ providedIn: 'root' })
export class ChartScaffoldService {
  private _scaffold$ = new BehaviorSubject<ChartScaffold | null>(null);

  /** Observable if you ever want to react to scaffold changes */
  readonly scaffold$ = this._scaffold$.asObservable();

  /** Set once from TechanTs (or update if layout changes) */
  set scaffold(value: ChartScaffold | null) {
    this._scaffold$.next(value);
  }

  /** Synchronous access to latest */
  get scaffold(): ChartScaffold | null {
    return this._scaffold$.value; }

  clear() {
    this._scaffold$.next(null);
  }
}
