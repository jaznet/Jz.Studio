export interface ChartCoordinate {
  date: Date;
  value: number;
}

export interface CrosshairReadout {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  sma150?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  rsi?: number;
}

export interface TrendLine {
  id: string;
  start: ChartCoordinate;
  end: ChartCoordinate;
}

export interface SupportResistanceLine {
  id: string;
  value: number;
  label?: string;
}

export interface TradeMarker {
  id: string;
  date: Date;
  price: number;
  kind: 'buy' | 'sell' | 'event';
  label?: string;
}

export interface CrosshairState {
  visible: boolean;
  coordinate?: ChartCoordinate;
  readout?: CrosshairReadout;
}

export interface ChartDrawingState {
  trendLines: readonly TrendLine[];
  supportResistanceLines: readonly SupportResistanceLine[];
  tradeMarkers: readonly TradeMarker[];
}