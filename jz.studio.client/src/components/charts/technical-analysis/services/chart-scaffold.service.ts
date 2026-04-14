// chart-scaffold.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScaffoldFramework } from '../interfaces/scaffold-framework.interface';

@Injectable({ providedIn: 'root' })
export class ChartScaffoldService {
  private _scaffold$ = new BehaviorSubject<ScaffoldFramework | null>(null);

  /** Observable if you ever want to react to scaffold changes */
  readonly scaffold$ = this._scaffold$.asObservable();

  /** Set once from TechanTs (or update if layout changes) */
  set scaffold(value: ScaffoldFramework | null) {
    this._scaffold$.next(value);
  }

  /** Synchronous access to latest */
  get scaffold(): ScaffoldFramework | null {
    return this._scaffold$.value; }

  clear() {
    this._scaffold$.next(null);
  }
}
