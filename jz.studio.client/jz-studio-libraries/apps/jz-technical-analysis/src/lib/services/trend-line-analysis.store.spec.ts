import { TestBed } from '@angular/core/testing';

import { TrendLineAnalysisResponse } from '../models/trend-line-analysis.model';
import { TrendLineAnalysisStore } from './trend-line-analysis.store';

describe('TrendLineAnalysisStore', () => {
  let store: TrendLineAnalysisStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TrendLineAnalysisStore);
    store.reset();
  });

  it('starts idle', () => {
    expect(store.state).toEqual({
      status: 'idle',
      analysis: null,
      error: null
    });
  });

  it('retains the previous analysis while refreshing', () => {
    const analysis = response();
    store.set(analysis);

    store.beginLoading();

    expect(store.state).toEqual({
      status: 'loading',
      analysis,
      error: null
    });
  });

  it('stores a successful analysis', () => {
    const analysis = response();

    store.set(analysis);

    expect(store.state).toEqual({
      status: 'loaded',
      analysis,
      error: null
    });
  });

  it('retains the previous analysis when refreshing fails', () => {
    const analysis = response();
    const error = new Error('unavailable');
    store.set(analysis);

    store.fail(error);

    expect(store.state).toEqual({
      status: 'error',
      analysis,
      error
    });
  });

  function response(): TrendLineAnalysisResponse {
    return {
      ticker: 'NVDA',
      from: '2025-01-01',
      to: '2026-01-01',
      priceBarCount: 250,
      swingPointCount: 20,
      candidateCount: 90,
      support: null,
      resistance: null
    };
  }
});
