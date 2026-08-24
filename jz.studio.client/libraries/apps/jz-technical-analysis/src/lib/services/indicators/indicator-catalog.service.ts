import { Injectable } from '@angular/core';

export type IndicatorPlacement = 'price-overlay' | 'panel';

export interface IndicatorDefinition {
  id: string;
  name: string;
  placement: IndicatorPlacement;
  defaultPeriod?: number;
}

@Injectable({ providedIn: 'root' })
export class IndicatorCatalogService {
  readonly definitions: readonly IndicatorDefinition[] = [
    { id: 'sma', name: 'Simple Moving Average', placement: 'price-overlay', defaultPeriod: 20 },
    { id: 'ema', name: 'Exponential Moving Average', placement: 'price-overlay', defaultPeriod: 20 },
    { id: 'vwap', name: 'Volume Weighted Average Price', placement: 'price-overlay' },
    { id: 'atr-stop', name: 'ATR Trailing Stop', placement: 'price-overlay', defaultPeriod: 14 },
    { id: 'ichimoku', name: 'Ichimoku Cloud', placement: 'price-overlay' },
    { id: 'atr', name: 'Average True Range', placement: 'panel', defaultPeriod: 14 },
    { id: 'stochastic', name: 'Stochastic', placement: 'panel', defaultPeriod: 14 },
    { id: 'momentum', name: 'Momentum', placement: 'panel', defaultPeriod: 10 },
    { id: 'roc', name: 'Rate of Change', placement: 'panel', defaultPeriod: 12 },
    { id: 'sroc', name: 'Smoothed Rate of Change', placement: 'panel', defaultPeriod: 12 },
    { id: 'money-flow', name: 'Money Flow Index', placement: 'panel', defaultPeriod: 14 },
    { id: 'williams-r', name: 'Williams %R', placement: 'panel', defaultPeriod: 14 }
  ];
}
