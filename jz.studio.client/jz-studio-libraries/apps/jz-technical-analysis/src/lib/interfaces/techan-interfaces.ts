import { ChartType } from "../enums/chart-type";

export interface RectDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SvgAttributes {
  height: number;
  width: number;
}
export interface ohlcData {
  timestamp: Date;
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface range {
  start: number;
  end: number;
}

interface DateType {
  date: Date;
  isValid: boolean;
}

interface DataType {
  date: Date | string;
  open: number;
  close: number;
}
