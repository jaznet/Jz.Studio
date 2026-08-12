import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DailyPriceDto, StockPriceHistory } from 'jz-technical-analysis';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketPriceService {
  private readonly apiUrl = '/api/market/daily-prices';

  constructor(private readonly http: HttpClient) { }

  getStockPrices(ticker: string): Observable<StockPriceHistory[]> {
    return this.http.get<DailyPriceDto[]>(`${this.apiUrl}/${ticker}`).pipe(
      map(prices => prices.map((price, index) => this.toStockPriceHistory(price, index)))
    );
  }

  private toStockPriceHistory(price: DailyPriceDto, index: number): StockPriceHistory {
    const date = new Date(price.tradeDate);

    return {
      id: index,
      timestamp: date,
      ticker: price.ticker,
      date,
      open: price.open,
      high: price.high,
      low: price.low,
      close: price.close,
      volume: price.volume
    };
  }
}
