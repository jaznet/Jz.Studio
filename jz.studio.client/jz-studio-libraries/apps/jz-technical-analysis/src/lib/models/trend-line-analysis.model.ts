export interface CalculatedTrendLine {
  type: 'Support' | 'Resistance';
  startDate: string;
  startValue: number;
  endDate: string;
  endValue: number;
  projectedDate: string;
  projectedValue: number;
  touchCount: number;
  violationCount: number;
  barsSinceLastAnchor: number;
  currentDistanceRatio: number;
  score: number;
}

export interface TrendLineAnalysisResponse {
  ticker: string;
  from: string;
  to: string;
  priceBarCount: number;
  swingPointCount: number;
  candidateCount: number;
  support: CalculatedTrendLine | null;
  resistance: CalculatedTrendLine | null;
}

export interface TrendLineAnalysisRequest {
  from?: string;
  to?: string;
  maximumBars?: number;
}

export type TrendLineAnalysisStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface TrendLineAnalysisState {
  status: TrendLineAnalysisStatus;
  analysis: TrendLineAnalysisResponse | null;
  error: unknown | null;
}

export const EMPTY_TREND_LINE_ANALYSIS_STATE: TrendLineAnalysisState = {
  status: 'idle',
  analysis: null,
  error: null
};
