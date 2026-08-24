import { Injectable } from '@angular/core';

import {
  DEFAULT_TECHNICAL_INDICATOR_OPTIONS,
  TechnicalIndicatorOptions
} from '../../interfaces/indicator-options.interface';
import {
  AtrTrailingStopPoint,
  DatedValuePoint,
  IchimokuPoint,
  MoneyFlowPoint,
  StochasticPoint,
  TechnicalIndicatorSet
} from '../../models/indicator-points.model';
import { TechnicalAnalysisDataPoint } from '../../models/technical-analysis-data.model';
import { ema, rollingMaximum, rollingMinimum, sma } from '../../utils/ta-math';

@Injectable({ providedIn: 'root' })
export class TechnicalIndicatorCalculatorService {
  calculate(
    points: readonly TechnicalAnalysisDataPoint[],
    options: Partial<TechnicalIndicatorOptions> = {}
  ): TechnicalIndicatorSet {
    const s = { ...DEFAULT_TECHNICAL_INDICATOR_OPTIONS, ...options };
    return {
      ema: this.ema(points, s.emaPeriod),
      atr: this.atr(points, s.atrPeriod),
      stochastic: this.stochastic(points, s.stochasticPeriod, s.stochasticSignalPeriod),
      momentum: this.change(points, s.momentumPeriod, false),
      roc: this.change(points, s.rocPeriod, true),
      sroc: this.sroc(points, s.srocPeriod, s.srocSmoothingPeriod),
      moneyFlow: this.moneyFlow(points, s.moneyFlowPeriod),
      williamsR: this.williamsR(points, s.williamsPeriod),
      vwap: this.vwap(points),
      atrTrailingStop: this.atrTrailingStop(
        points, s.atrPeriod, s.atrTrailingStopMultiplier
      ),
      ichimoku: this.ichimoku(
        points, s.ichimokuConversionPeriod, s.ichimokuBasePeriod,
        s.ichimokuSpanPeriod
      )
    };
  }

  ema(points: readonly TechnicalAnalysisDataPoint[], period: number): DatedValuePoint[] {
    return this.dated(points, ema(points.map(point => point.close), period));
  }

  atr(points: readonly TechnicalAnalysisDataPoint[], period: number): DatedValuePoint[] {
    const ranges = points.map((point, index) => index === 0
      ? point.high - point.low
      : Math.max(
          point.high - point.low,
          Math.abs(point.high - points[index - 1].close),
          Math.abs(point.low - points[index - 1].close)
        ));
    return this.dated(points, ema(ranges, period, 1 / period));
  }

  stochastic(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number,
    signalPeriod: number
  ): StochasticPoint[] {
    const highs = rollingMaximum(points.map(point => point.high), period);
    const lows = rollingMinimum(points.map(point => point.low), period);
    const k = points.map((point, index) => {
      const high = highs[index], low = lows[index];
      return high === null || low === null || high === low
        ? null : ((point.close - low) / (high - low)) * 100;
    });
    const d = sma(k, signalPeriod);
    return points.flatMap((point, index) =>
      k[index] === null || d[index] === null
        ? [] : [{ date: point.date, k: k[index]!, d: d[index]! }]
    );
  }

  change(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number,
    percentage: boolean
  ): DatedValuePoint[] {
    return points.slice(period).flatMap((point, offset) => {
      const previous = points[offset].close;
      if (percentage && previous === 0) return [];
      return [{
        date: point.date,
        value: percentage
          ? ((point.close - previous) / previous) * 100
          : point.close - previous
      }];
    });
  }

  sroc(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number,
    smoothingPeriod: number
  ): DatedValuePoint[] {
    const values = ema(points.map(point => point.close), smoothingPeriod);
    return points.slice(period).flatMap((point, offset) => {
      const current = values[offset + period], previous = values[offset];
      return current === null || previous === null || previous === 0
        ? [] : [{ date: point.date, value: ((current - previous) / previous) * 100 }];
    });
  }

  moneyFlow(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number
  ): MoneyFlowPoint[] {
    const typical = points.map(point => (point.high + point.low + point.close) / 3);
    const raw = points.map((point, index) => typical[index] * point.volume);
    return points.slice(period).map((point, offset) => {
      let positive = 0, negative = 0;
      for (let index = offset + 1; index <= offset + period; index++) {
        if (typical[index] >= typical[index - 1]) positive += raw[index];
        else negative += raw[index];
      }
      return {
        date: point.date,
        value: negative === 0 ? 100 : 100 - 100 / (1 + positive / negative)
      };
    });
  }

  williamsR(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number
  ): DatedValuePoint[] {
    const highs = rollingMaximum(points.map(point => point.high), period);
    const lows = rollingMinimum(points.map(point => point.low), period);
    return points.flatMap((point, index) => {
      const high = highs[index], low = lows[index];
      return high === null || low === null || high === low
        ? [] : [{ date: point.date, value: -100 * (high - point.close) / (high - low) }];
    });
  }

  vwap(points: readonly TechnicalAnalysisDataPoint[]): DatedValuePoint[] {
    let value = 0, volume = 0;
    return points.flatMap(point => {
      value += ((point.high + point.low + point.close) / 3) * point.volume;
      volume += point.volume;
      return volume === 0 ? [] : [{ date: point.date, value: value / volume }];
    });
  }

  atrTrailingStop(
    points: readonly TechnicalAnalysisDataPoint[],
    period: number,
    multiplier: number
  ): AtrTrailingStopPoint[] {
    const atr = new Map(this.atr(points, period).map(point => [
      point.date.getTime(), point.value
    ]));
    let direction: 'long' | 'short' = 'long';
    let stop: number | undefined;
    return points.flatMap(point => {
      const range = atr.get(point.date.getTime());
      if (range === undefined) return [];
      const longStop = point.close - multiplier * range;
      const shortStop = point.close + multiplier * range;
      if (stop === undefined) stop = longStop;
      else if (direction === 'long' && point.close < stop) {
        direction = 'short'; stop = shortStop;
      } else if (direction === 'short' && point.close > stop) {
        direction = 'long'; stop = longStop;
      } else {
        stop = direction === 'long'
          ? Math.max(stop, longStop) : Math.min(stop, shortStop);
      }
      return [{ date: point.date, value: stop, direction }];
    });
  }

  ichimoku(
    points: readonly TechnicalAnalysisDataPoint[],
    conversionPeriod: number,
    basePeriod: number,
    spanPeriod: number
  ): IchimokuPoint[] {
    const highs = points.map(point => point.high);
    const lows = points.map(point => point.low);
    const ch = rollingMaximum(highs, conversionPeriod);
    const cl = rollingMinimum(lows, conversionPeriod);
    const bh = rollingMaximum(highs, basePeriod);
    const bl = rollingMinimum(lows, basePeriod);
    const sh = rollingMaximum(highs, spanPeriod);
    const sl = rollingMinimum(lows, spanPeriod);
    return points.flatMap((point, index) => {
      if ([ch[index], cl[index], bh[index], bl[index], sh[index], sl[index]]
        .some(value => value === null)) return [];
      const conversion = (ch[index]! + cl[index]!) / 2;
      const base = (bh[index]! + bl[index]!) / 2;
      return [{
        date: point.date, conversion, base,
        leadingA: (conversion + base) / 2,
        leadingB: (sh[index]! + sl[index]!) / 2,
        lagging: point.close
      }];
    });
  }

  private dated(
    points: readonly TechnicalAnalysisDataPoint[],
    values: readonly (number | null)[]
  ): DatedValuePoint[] {
    return points.flatMap((point, index) => values[index] === null
      ? [] : [{ date: point.date, value: values[index]! }]);
  }
}
