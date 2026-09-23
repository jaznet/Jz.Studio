export interface JzTechnicalAnalysisPalette {
  name: string;
  structure: JzTechnicalAnalysisStructurePalette;
  data: JzTechnicalAnalysisDataPalette;
  interaction: JzTechnicalAnalysisInteractionPalette;
}

export interface JzTechnicalAnalysisStructurePalette {
  workspace: string;
  priceSurface: string;
  indicatorSurface: string;
  toolbar: string;
  border: string;
  seam: string;
  grid: string;
  axis: string;
  labelPrimary: string;
  labelSecondary: string;
}

export interface JzTechnicalAnalysisDataPalette {
  bullish: string;
  bearish: string;
  wick: string;
  sma20: string;
  sma50: string;
  sma150: string;
  volumeBullish: string;
  volumeBearish: string;
  macd: string;
  signal: string;
  histogramPositive: string;
  histogramNegative: string;
  rsi: string;
  reference: string;
}

export interface JzTechnicalAnalysisInteractionPalette {
  crosshair: string;
  selection: string;
  focus: string;
  warning: string;
  error: string;
}
