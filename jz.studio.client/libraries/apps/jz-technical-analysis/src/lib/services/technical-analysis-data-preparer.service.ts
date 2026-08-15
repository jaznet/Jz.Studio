import { Injectable } from '@angular/core';
import { extent, max, min } from 'd3-array';

import { StockPriceHistory } from '../models/stock-price-history.model';
import {
  EMPTY_TECHNICAL_ANALYSIS_DATA,
  MacdPoint,
  TechnicalAnalysisDataModel,
  TechnicalAnalysisDataPoint
} from '../models/technical-analysis-data.model';

@Injectable({ providedIn: 'root' })
export class TechnicalAnalysisDataPreparer {
  prepare(source: readonly StockPriceHistory[]): TechnicalAnalysisDataModel {
    const points = source
      .map(item => this.toDataPoint(item))
      .filter((item): item is TechnicalAnalysisDataPoint => item !== undefined)
      .filter(item => item.date.getDay() !== 0 && item.date.getDay() !== 6)
      .sort((left, right) => left.date.getTime() - right.date.getTime());

    if (points.length === 0) {
      return EMPTY_TECHNICAL_ANALYSIS_DATA;
    }

    const priceValues = points.flatMap(item => [
      item.open,
      item.high,
      item.low,
      item.close
    ]);

    return {
      points,
      macd: this.calculateMacd(points, 12, 26, 9),
      dateExtent: extent(points, item => item.date) as [Date, Date],
      minPrice: min(priceValues),
      maxPrice: max(priceValues),
      maxVolume: max(points, item => item.volume)
    };
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
