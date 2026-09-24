import { Injectable, signal } from '@angular/core';

import {
  ChartCoordinate,
  ChartDrawingState,
  SupportResistanceLine,
  TradeMarker,
  TrendLine
} from '../../models/chart-drawing.model';

const EMPTY_DRAWINGS: ChartDrawingState = {
  trendLines: [],
  supportResistanceLines: [],
  tradeMarkers: []
};

@Injectable({ providedIn: 'root' })
export class ChartDrawingService {
  readonly state = signal<ChartDrawingState>(EMPTY_DRAWINGS);

  addTrendLine(start: ChartCoordinate, end: ChartCoordinate): TrendLine {
    const line = { id: this.id('trend'), start, end };
    this.state.update(state => ({
      ...state,
      trendLines: [...state.trendLines, line]
    }));
    return line;
  }

  addSupportResistanceLine(value: number, label?: string): SupportResistanceLine {
    const line = { id: this.id('level'), value, label };
    this.state.update(state => ({
      ...state,
      supportResistanceLines: [...state.supportResistanceLines, line]
    }));
    return line;
  }

  addTradeMarker(marker: Omit<TradeMarker, 'id'>): TradeMarker {
    const result = { ...marker, id: this.id('trade') };
    this.state.update(state => ({
      ...state,
      tradeMarkers: [...state.tradeMarkers, result]
    }));
    return result;
  }

  remove(id: string): void {
    this.state.update(state => ({
      trendLines: state.trendLines.filter(item => item.id !== id),
      supportResistanceLines: state.supportResistanceLines.filter(item => item.id !== id),
      tradeMarkers: state.tradeMarkers.filter(item => item.id !== id)
    }));
  }

  clear(): void {
    this.state.set(EMPTY_DRAWINGS);
  }

  private id(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
  }
}
