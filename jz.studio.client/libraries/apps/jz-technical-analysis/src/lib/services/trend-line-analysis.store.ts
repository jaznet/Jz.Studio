import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  EMPTY_TREND_LINE_ANALYSIS_STATE,
  TrendLineAnalysisResponse,
  TrendLineAnalysisState
} from '../models/trend-line-analysis.model';

@Injectable({ providedIn: 'root' })
export class TrendLineAnalysisStore {
  private readonly stateSubject =
    new BehaviorSubject<TrendLineAnalysisState>(
      EMPTY_TREND_LINE_ANALYSIS_STATE
    );

  readonly state$: Observable<TrendLineAnalysisState> =
    this.stateSubject.asObservable();

  get state(): TrendLineAnalysisState {
    return this.stateSubject.value;
  }

  beginLoading(): void {
    this.stateSubject.next({
      status: 'loading',
      analysis: this.state.analysis,
      error: null
    });
  }

  set(analysis: TrendLineAnalysisResponse): void {
    this.stateSubject.next({
      status: 'loaded',
      analysis,
      error: null
    });
  }

  fail(error: unknown): void {
    this.stateSubject.next({
      status: 'error',
      analysis: this.state.analysis,
      error
    });
  }

  reset(): void {
    this.stateSubject.next(EMPTY_TREND_LINE_ANALYSIS_STATE);
  }
}
