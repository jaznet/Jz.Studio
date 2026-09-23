import { Injectable } from '@angular/core';

import {
  DEFAULT_TECHNICAL_INDICATOR_OPTIONS,
  TechnicalIndicatorOptions
} from '../../interfaces/indicator-options.interface';
import {
  AtrTrailingStopPoint,
  AdxPoint,
  AroonPoint,
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
      adx: this.adx(points, s.adxPeriod),
      aroon: this.aroon(points, s.aroonPeriod),
      bollingerWidth: this.bollingerWidth(points, s.bollingerPeriod),
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

  adx(points: readonly TechnicalAnalysisDataPoint[], period: number): AdxPoint[] {
    if (period <= 0 || points.length < period * 2) return [];

    const trueRange = Array<number>(points.length).fill(0);
    const plusDm = Array<number>(points.length).fill(0);
    const minusDm = Array<number>(points.length).fill(0);
    for (let index = 1; index < points.length; index++) {
      const upward = points[index].high - points[index - 1].high;
      const downward = points[index - 1].low - points[index].low;
      plusDm[index] = upward > downward && upward > 0 ? upward : 0;
      minusDm[index] = downward > upward && downward > 0 ? downward : 0;
      trueRange[index] = Math.max(
        points[index].high - points[index].low,
        Math.abs(points[index].high - points[index - 1].close),
        Math.abs(points[index].low - points[index - 1].close)
      );
    }

    const plusDi = Array<number | null>(points.length).fill(null);
    const minusDi = Array<number | null>(points.length).fill(null);
    const dx = Array<number | null>(points.length).fill(null);
    let smoothedRange = trueRange.slice(1, period + 1).reduce((sum, value) => sum + value, 0);
    let smoothedPlus = plusDm.slice(1, period + 1).reduce((sum, value) => sum + value, 0);
    let smoothedMinus = minusDm.slice(1, period + 1).reduce((sum, value) => sum + value, 0);

    for (let index = period; index < points.length; index++) {
      if (index > period) {
        smoothedRange = smoothedRange - smoothedRange / period + trueRange[index];
        smoothedPlus = smoothedPlus - smoothedPlus / period + plusDm[index];
        smoothedMinus = smoothedMinus - smoothedMinus / period + minusDm[index];
      }
      plusDi[index] = smoothedRange === 0 ? 0 : 100 * smoothedPlus / smoothedRange;
      minusDi[index] = smoothedRange === 0 ? 0 : 100 * smoothedMinus / smoothedRange;
      const total = plusDi[index]! + minusDi[index]!;
      dx[index] = total === 0 ? 0 : 100 * Math.abs(plusDi[index]! - minusDi[index]!) / total;
    }

    const firstAdxIndex = period * 2 - 1;
    let currentAdx = dx.slice(period, firstAdxIndex + 1)
      .reduce<number>((sum, value) => sum + (value ?? 0), 0) / period;

    const result: AdxPoint[] = [];
    for (let index = firstAdxIndex; index < points.length; index++) {
      if (index > firstAdxIndex) {
        currentAdx = ((currentAdx * (period - 1)) + (dx[index] ?? 0)) / period;
      }
      result.push({
        date: points[index].date,
        adx: currentAdx,
        plusDi: plusDi[index] ?? 0,
        minusDi: minusDi[index] ?? 0
      });
    }
    return result;
  }

  aroon(points: readonly TechnicalAnalysisDataPoint[], period: number): AroonPoint[] {
    if (period <= 0) return [];
    return points.slice(period - 1).map((point, offset) => {
      const end = offset + period;
      const window = points.slice(offset, end);
      let highIndex = 0, lowIndex = 0;
      window.forEach((item, index) => {
        if (item.high >= window[highIndex].high) highIndex = index;
        if (item.low <= window[lowIndex].low) lowIndex = index;
      });
      return {
        date: point.date,
        up: 100 * highIndex / (period - 1 || 1),
        down: 100 * lowIndex / (period - 1 || 1)
      };
    });
  }

  bollingerWidth(
    points: readonly TechnicalAnalysisDataPoint[], period: number
  ): DatedValuePoint[] {
    if (period <= 1) return [];
    return points.slice(period - 1).flatMap((point, offset) => {
      const values = points.slice(offset, offset + period).map(item => item.close);
      const average = values.reduce((sum, value) => sum + value, 0) / period;
      if (average === 0) return [];
      const deviation = Math.sqrt(values.reduce(
        (sum, value) => sum + Math.pow(value - average, 2), 0
      ) / period);
      return [{ date: point.date, value: 400 * deviation / average }];
    });
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
