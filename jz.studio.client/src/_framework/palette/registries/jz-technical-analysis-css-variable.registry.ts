import { JzTechnicalAnalysisPalette } from '../models/jz-palette.model';

type TechnicalAnalysisColorSelector =
  (palette: JzTechnicalAnalysisPalette) => string;

export const JZ_TECHNICAL_ANALYSIS_CSS_VARIABLES:
  Readonly<Record<string, TechnicalAnalysisColorSelector>> = {

  '--jz-ta-workspace': palette => palette.structure.workspace,
  '--jz-ta-price-surface': palette => palette.structure.priceSurface,
  '--jz-ta-indicator-surface': palette => palette.structure.indicatorSurface,
  '--jz-ta-toolbar': palette => palette.structure.toolbar,
  '--jz-ta-border': palette => palette.structure.border,
  '--jz-ta-seam': palette => palette.structure.seam,
  '--jz-ta-grid': palette => palette.structure.grid,
  '--jz-ta-axis': palette => palette.structure.axis,
  '--jz-ta-label-primary': palette => palette.structure.labelPrimary,
  '--jz-ta-label-secondary': palette => palette.structure.labelSecondary,

  '--jz-ta-bullish': palette => palette.data.bullish,
  '--jz-ta-bearish': palette => palette.data.bearish,
  '--jz-ta-wick': palette => palette.data.wick,
  '--jz-ta-sma-20': palette => palette.data.sma20,
  '--jz-ta-sma-50': palette => palette.data.sma50,
  '--jz-ta-sma-150': palette => palette.data.sma150,
  '--jz-ta-volume-bullish': palette => palette.data.volumeBullish,
  '--jz-ta-volume-bearish': palette => palette.data.volumeBearish,
  '--jz-ta-macd': palette => palette.data.macd,
  '--jz-ta-signal': palette => palette.data.signal,
  '--jz-ta-histogram-positive': palette => palette.data.histogramPositive,
  '--jz-ta-histogram-negative': palette => palette.data.histogramNegative,
  '--jz-ta-rsi': palette => palette.data.rsi,
  '--jz-ta-reference': palette => palette.data.reference,

  '--jz-ta-crosshair': palette => palette.interaction.crosshair,
  '--jz-ta-selection': palette => palette.interaction.selection,
  '--jz-ta-focus': palette => palette.interaction.focus,
  '--jz-ta-warning': palette => palette.interaction.warning,
  '--jz-ta-error': palette => palette.interaction.error
};
