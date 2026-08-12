// src/app/models/stock-price-history.model.ts
export interface StockPriceHistory {
  id: number;
  timestamp: Date;
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
