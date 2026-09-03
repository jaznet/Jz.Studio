export interface JzPalette {
  name: string;

  clr1: string;
  clr2: string;
  clr3: string;
  clr4: string;
  clr5: string;

  txt1: string;
  txt2: string;
  txt3: string;
  txt4: string;
  txt5: string;

  pop: string;
  popTxt: string;

  highlight: string;
  highlightTxt: string;

  activeBoundary: string;
  activeBoundaryTxt: string;

  logo: string;
  logoTxt: string;

  technicalAnalysis?: JzTechnicalAnalysisPalette;
}

export interface JzPaletteAccents {
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  muted?: string;
}

export interface JzTechnicalAnalysisPalette {
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
