import { Injectable } from '@angular/core';
import { extent, max, min } from 'd3-array';

import { StockPriceHistory } from '../models/stock-price-history.model';
import {
  EMPTY_TECHNICAL_ANALYSIS_DATA,
  MacdPoint,
  TechnicalAnalysisDataModel,
  TechnicalAnalysisDataWindow,
  TechnicalAnalysisDataPoint
} from '../models/technical-analysis-data.model';
import { TechnicalIndicatorCalculatorService } from './indicators/technical-indicator-calculator.service';

@Injectable({ providedIn: 'root' })
export class TechnicalAnalysisDataPreparer {
  constructor(
    private readonly indicatorCalculator: TechnicalIndicatorCalculatorService
  ) {}

  prepare(
    source: readonly StockPriceHistory[],
    window?: TechnicalAnalysisDataWindow
  ): TechnicalAnalysisDataModel {
    const calculationPoints = source
      .map(item => this.toDataPoint(item))
      .filter((item): item is TechnicalAnalysisDataPoint => item !== undefined)
      .filter(item => item.date.getDay() !== 0 && item.date.getDay() !== 6)
      .sort((left, right) => left.date.getTime() - right.date.getTime());

    if (calculationPoints.length === 0) {
      return EMPTY_TECHNICAL_ANALYSIS_DATA;
    }

    const points = calculationPoints.filter(item =>
      this.isVisible(item.date, window)
    );

    if (points.length === 0) {
      return {
        ...EMPTY_TECHNICAL_ANALYSIS_DATA,
        calculationPoints
      };
    }

    const priceValues = points.flatMap(item => [
      item.open,
      item.high,
      item.low,
      item.close
    ]);

    return {
      calculationPoints,
      points,
      macd: this.calculateMacd(calculationPoints, 12, 26, 9)
        .filter(item => this.isVisible(item.date, window)),
      indicators: this.filterIndicators(
        this.indicatorCalculator.calculate(calculationPoints),
        window
      ),
      dateExtent: extent(points, item => item.date) as [Date, Date],
      minPrice: min(priceValues),
      maxPrice: max(priceValues),
      maxVolume: max(points, item => item.volume)
    };
  }

  private filterIndicators(
    indicators: TechnicalAnalysisDataModel['indicators'],
    window?: TechnicalAnalysisDataWindow
  ): TechnicalAnalysisDataModel['indicators'] {
    const visible = <T extends { date: Date }>(points: readonly T[]): T[] =>
      points.filter(point => this.isVisible(point.date, window));
    return {
      ema: visible(indicators.ema),
      atr: visible(indicators.atr),
      stochastic: visible(indicators.stochastic),
      momentum: visible(indicators.momentum),
      roc: visible(indicators.roc),
      sroc: visible(indicators.sroc),
      moneyFlow: visible(indicators.moneyFlow),
      williamsR: visible(indicators.williamsR),
      vwap: visible(indicators.vwap),
      atrTrailingStop: visible(indicators.atrTrailingStop),
      ichimoku: visible(indicators.ichimoku)
    };
  }

  private isVisible(
    date: Date,
    window?: TechnicalAnalysisDataWindow
  ): boolean {
    const timestamp = date.getTime();
    const visibleStart = window?.visibleStart?.getTime();
    const visibleEnd = window?.visibleEnd?.getTime();

    return (
      (visibleStart === undefined || timestamp >= visibleStart) &&
      (visibleEnd === undefined || timestamp <= visibleEnd)
    );
  }

  private toDataPoint(
    item: StockPriceHistory
  ): TechnicalAnalysisDataPoint | undefined {
    const date = new Date(item.date);

    if (
      Number.isNaN(date.getTime()) ||
      !this.hasFiniteMarketValues(item)
    ) {
      return undefined;
    }

    return {
      ...item,
      date,
      timestamp: new Date(item.timestamp)
    };
  }

  private hasFiniteMarketValues(item: StockPriceHistory): boolean {
    return [
      item.open,
      item.high,
      item.low,
      item.close,
      item.volume
    ].every(Number.isFinite);
  }

  private calculateMacd(
    data: readonly TechnicalAnalysisDataPoint[],
    shortPeriod: number,
    longPeriod: number,
    signalPeriod: number
  ): MacdPoint[] {
    const closeValues = data.map(item => item.close);
    const emaShort = this.calculateEma(closeValues, shortPeriod);
    const emaLong = this.calculateEma(closeValues, longPeriod);

    const macdLine = emaShort.map(
      (shortValue, index) => shortValue - emaLong[index]
    );
    const signalLine = this.calculateEma(macdLine, signalPeriod);

    return macdLine.map((macd, index) => ({
      date: data[index].date,
      macd,
      signal: signalLine[index],
      histogram: macd - signalLine[index]
    }));
  }

  private calculateEma(
    values: readonly number[],
    period: number
  ): number[] {
    if (values.length === 0) {
      return [];
    }

    const multiplier = 2 / (period + 1);
    const ema: number[] = [];
    let previous = values[0];

    for (const value of values) {
      previous = (value - previous) * multiplier + previous;
      ema.push(previous);
    }

    return ema;
  }
}
