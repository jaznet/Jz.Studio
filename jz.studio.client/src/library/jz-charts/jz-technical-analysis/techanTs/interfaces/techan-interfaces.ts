
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface chart_attributes {
  height: number;
  width: number;
 // margin: number;
  xAxisTop: number;
  xAxisBottom: number;
  yAxisLeft: number;
  yAxisRight: number;
}

export interface SvgAttributes {
  height: number;
  width: number;

}

export interface SectionAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  margins: Margins;
  fill?: string;
}

export interface olhcData {
  timestamp: Date;
  ticker: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
