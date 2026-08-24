export interface TechnicalIndicatorOptions {
  emaPeriod: number;
  atrPeriod: number;
  stochasticPeriod: number;
  stochasticSignalPeriod: number;
  momentumPeriod: number;
  rocPeriod: number;
  srocPeriod: number;
  srocSmoothingPeriod: number;
  moneyFlowPeriod: number;
  williamsPeriod: number;
  atrTrailingStopMultiplier: number;
  ichimokuConversionPeriod: number;
  ichimokuBasePeriod: number;
  ichimokuSpanPeriod: number;
}

export const DEFAULT_TECHNICAL_INDICATOR_OPTIONS: TechnicalIndicatorOptions = {
  emaPeriod: 20, atrPeriod: 14, stochasticPeriod: 14,
  stochasticSignalPeriod: 3, momentumPeriod: 10, rocPeriod: 12,
  srocPeriod: 12, srocSmoothingPeriod: 13, moneyFlowPeriod: 14,
  williamsPeriod: 14, atrTrailingStopMultiplier: 3,
  ichimokuConversionPeriod: 9, ichimokuBasePeriod: 26,
  ichimokuSpanPeriod: 52
};
