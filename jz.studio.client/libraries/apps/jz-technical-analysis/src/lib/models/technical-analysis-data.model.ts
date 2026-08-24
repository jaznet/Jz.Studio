import { StockPriceHistory } from './stock-price-history.model';
import {
  EMPTY_TECHNICAL_INDICATORS,
  TechnicalIndicatorSet
} from './indicator-points.model';

export interface TechnicalAnalysisDataPoint extends StockPriceHistory {
  date: Date;
  timestamp: Date;
}

export interface MacdPoint {
  date: Date;
  macd: number;
  signal: number;
  histogram: number;
}

export interface TechnicalAnalysisDataWindow {
  visibleStart?: Date;
  visibleEnd?: Date;
}

export interface TechnicalAnalysisDataModel {
  calculationPoints: readonly TechnicalAnalysisDataPoint[];
  points: readonly TechnicalAnalysisDataPoint[];
  macd: readonly MacdPoint[];
  indicators: TechnicalIndicatorSet;
  dateExtent: [Date, Date] | [undefined, undefined];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  maxVolume: number | undefined;
}

export const EMPTY_TECHNICAL_ANALYSIS_DATA: TechnicalAnalysisDataModel = {
  calculationPoints: [],
  points: [],
  macd: [],
  indicators: EMPTY_TECHNICAL_INDICATORS,
  dateExtent: [undefined, undefined],
  minPrice: undefined,
  maxPrice: undefined,
  maxVolume: undefined
};
