// technical-analysis/models/daily-price.dto.ts

export interface DailyPriceDto {
  ticker: string;
  tradeDate: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
