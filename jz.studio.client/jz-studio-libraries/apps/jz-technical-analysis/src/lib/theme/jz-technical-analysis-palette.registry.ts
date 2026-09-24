import { JzTechnicalAnalysisPalette } from './jz-technical-analysis-palette.model';

export const JZ_TECHNICAL_ANALYSIS_PALETTES:
  Readonly<Record<string, JzTechnicalAnalysisPalette>> = {

  charcoal: {
    name: 'charcoal',
    structure: {
      workspace: '#111111',
      priceSurface: '#202020',
      indicatorSurface: '#161616',
      toolbar: '#262626',
      border: '#414141',
      seam: '#525252',
      grid: '#363636',
      axis: '#777777',
      labelPrimary: '#D8D8D5',
      labelSecondary: '#999996'
    },
    data: {
      bullish: '#4BA2C8',
      bearish: '#D77F55',
      wick: '#AAB8C2',
      sma20: '#54A7C7',
      sma50: '#D6A451',
      sma150: '#A58AC5',
      volumeBullish: '#397A96',
      volumeBearish: '#A76043',
      macd: '#54A7C7',
      signal: '#D6A451',
      histogramPositive: '#397A96',
      histogramNegative: '#A76043',
      rsi: '#A58AC5',
      reference: '#596166'
    },
    interaction: {
      crosshair: '#C6CED2',
      selection: '#87CEEB',
      focus: '#A9DDF2',
      warning: '#E0A84E',
      error: '#E06C5C'
    }
  }
};
