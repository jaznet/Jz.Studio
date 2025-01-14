
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SectionAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  margins: Margins;
  fill?: string;
}

export interface CandlestickData {
  timestamp: Date;
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
