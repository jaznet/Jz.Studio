import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TrendLineAnalysisResponse } from '../models/trend-line-analysis.model';
import { TrendLineAnalysisService } from './trend-line-analysis.service';

describe('TrendLineAnalysisService', () => {
  let service: TrendLineAnalysisService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TrendLineAnalysisService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('requests analysis for a normalized ticker', () => {
    service.get(' nvda ').subscribe();

    const request = httpTesting.expectOne('/api/market/trendlines/NVDA');
    expect(request.request.method).toBe('GET');
    request.flush(response());
  });

  it('includes the selected date window and maximum bars', () => {
    service.get('NVDA', {
      from: '2025-01-01',
      to: '2026-01-01',
      maximumBars: 500
    }).subscribe();

    const request = httpTesting.expectOne(candidate =>
      candidate.url === '/api/market/trendlines/NVDA' &&
      candidate.params.get('from') === '2025-01-01' &&
      candidate.params.get('to') === '2026-01-01' &&
      candidate.params.get('maximumBars') === '500');
    request.flush(response());
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
