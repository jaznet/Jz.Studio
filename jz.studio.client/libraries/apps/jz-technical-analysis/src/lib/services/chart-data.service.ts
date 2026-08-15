import { Injectable } from '@angular/core';

import { StockPriceHistory } from '../models/stock-price-history.model';
import {
  MacdPoint,
  TechnicalAnalysisDataPoint
} from '../models/technical-analysis-data.model';
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

  load(source: readonly StockPriceHistory[]): void {
    this.store.set(this.preparer.prepare(source));
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
}
