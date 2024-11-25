
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
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}
