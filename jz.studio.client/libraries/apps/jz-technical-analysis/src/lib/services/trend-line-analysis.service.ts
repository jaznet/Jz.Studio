import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TrendLineAnalysisRequest,
  TrendLineAnalysisResponse
} from '../models/trend-line-analysis.model';

@Injectable({ providedIn: 'root' })
export class TrendLineAnalysisService {
  private readonly apiUrl = '/api/market/trendlines';

  constructor(private readonly http: HttpClient) { }

  get(
    ticker: string,
    request: TrendLineAnalysisRequest = {}
  ): Observable<TrendLineAnalysisResponse> {
    const normalizedTicker = ticker.trim().toUpperCase();
    const url = `${this.apiUrl}/${encodeURIComponent(normalizedTicker)}`;

    return this.http.get<TrendLineAnalysisResponse>(url, {
      params: this.params(request)
    });
  }

  private params(request: TrendLineAnalysisRequest): HttpParams {
    let params = new HttpParams();

    if (request.from) {
      params = params.set('from', request.from);
    }

    if (request.to) {
      params = params.set('to', request.to);
    }

    if (request.maximumBars !== undefined) {
      params = params.set('maximumBars', request.maximumBars);
    }

    return params;
  }
}
