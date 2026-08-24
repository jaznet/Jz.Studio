export interface DatedValuePoint { date: Date; value: number; }
export interface StochasticPoint { date: Date; k: number; d: number; }
export interface MoneyFlowPoint { date: Date; value: number; }
export interface AtrTrailingStopPoint {
  date: Date;
  value: number;
  direction: 'long' | 'short';
}
export interface IchimokuPoint {
  date: Date;
  conversion: number;
  base: number;
  leadingA: number;
  leadingB: number;
  lagging: number;
}
export interface TechnicalIndicatorSet {
  ema: readonly DatedValuePoint[];
  atr: readonly DatedValuePoint[];
  stochastic: readonly StochasticPoint[];
  momentum: readonly DatedValuePoint[];
  roc: readonly DatedValuePoint[];
  sroc: readonly DatedValuePoint[];
  moneyFlow: readonly MoneyFlowPoint[];
  williamsR: readonly DatedValuePoint[];
  vwap: readonly DatedValuePoint[];
  atrTrailingStop: readonly AtrTrailingStopPoint[];
  ichimoku: readonly IchimokuPoint[];
}

export const EMPTY_TECHNICAL_INDICATORS: TechnicalIndicatorSet = {
  ema: [],
  atr: [],
  stochastic: [],
  momentum: [],
  roc: [],
  sroc: [],
  moneyFlow: [],
  williamsR: [],
  vwap: [],
  atrTrailingStop: [],
  ichimoku: []
};
