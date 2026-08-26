import { Injectable } from '@angular/core';

import { CrosshairReadout } from '../models/chart-drawing.model';
import { StockPriceHistory } from '../models/stock-price-history.model';
import {
  MacdPoint,
  TechnicalAnalysisDataWindow,
  TechnicalAnalysisDataPoint
} from '../models/technical-analysis-data.model';
import { sma } from '../utils/ta-math';
import { TechnicalAnalysisDataPreparer } from './technical-analysis-data-preparer.service';
import { TechnicalAnalysisDataStore } from './technical-analysis-data.store';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  constructor(
    private readonly preparer: TechnicalAnalysisDataPreparer,
    private readonly store: TechnicalAnalysisDataStore
  ) { }

  load(
    source: readonly StockPriceHistory[],
    window?: TechnicalAnalysisDataWindow
  ): void {
    this.store.set(this.preparer.prepare(source, window));
  }

  get calculationData(): TechnicalAnalysisDataPoint[] {
    return [...this.store.model.calculationPoints];
  }

  get stockPriceHistoryData(): TechnicalAnalysisDataPoint[] {
    return [...this.store.model.points];
  }

  get parsedData(): TechnicalAnalysisDataPoint[] {
    return [...this.store.model.points];
  }

  get macdData(): MacdPoint[] {
    return [...this.store.model.macd];
  }

  get dateExtent(): [Date, Date] | [undefined, undefined] {
    return this.store.model.dateExtent;
  }

  get minPrice(): number | undefined {
    return this.store.model.minPrice;
  }

  get maxPrice(): number | undefined {
    return this.store.model.maxPrice;
  }

  get maxVolume(): number | undefined {
    return this.store.model.maxVolume;
  }

  getCrosshairReadout(date: Date): CrosshairReadout | undefined {
    const timestamp = date.getTime();
    const point = this.store.model.points.find(
      item => item.date.getTime() === timestamp
    );
    if (!point) return undefined;

    const macd = this.store.model.macd.find(
      item => item.date.getTime() === timestamp
    );

    return {
      date: point.date,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
      sma20: this.calculateSmaAt(timestamp, 20),
      sma50: this.calculateSmaAt(timestamp, 50),
      sma150: this.calculateSmaAt(timestamp, 150),
      macd: macd?.macd,
      signal: macd?.signal,
      histogram: macd?.histogram,
      rsi: this.calculateRsiAt(timestamp, 14)
    };
  }

  private calculateSmaAt(timestamp: number, period: number): number | undefined {
    const points = this.store.model.calculationPoints;
    const selectedIndex = points.findIndex(
      item => item.date.getTime() === timestamp
    );
    if (selectedIndex < 0) return undefined;

    return sma(
      points.map(item => item.close),
      period
    )[selectedIndex] ?? undefined;
  }

  private calculateRsiAt(timestamp: number, period: number): number | undefined {
    const points = this.store.model.calculationPoints;
    const selectedIndex = points.findIndex(
      item => item.date.getTime() === timestamp
    );
    if (selectedIndex < period) return undefined;

    let gainSum = 0;
    let lossSum = 0;
    for (let index = 1; index <= period; index++) {
      const change = points[index].close - points[index - 1].close;
      if (change >= 0) gainSum += change;
      else lossSum -= change;
    }

    let averageGain = gainSum / period;
    let averageLoss = lossSum / period;
    for (let index = period + 1; index <= selectedIndex; index++) {
      const change = points[index].close - points[index - 1].close;
      averageGain = (averageGain * (period - 1) + Math.max(change, 0)) / period;
      averageLoss = (averageLoss * (period - 1) + Math.max(-change, 0)) / period;
    }

    return averageLoss === 0
      ? 100
      : 100 - 100 / (1 + averageGain / averageLoss);
  }
}