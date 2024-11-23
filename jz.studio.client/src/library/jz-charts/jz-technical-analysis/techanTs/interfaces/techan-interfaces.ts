
export interface SvgElementAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
}


export interface CandlestickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}
