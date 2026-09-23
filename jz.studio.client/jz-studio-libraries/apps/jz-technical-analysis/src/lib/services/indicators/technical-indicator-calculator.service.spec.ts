import { TestBed } from '@angular/core/testing';

import { TechnicalAnalysisDataPoint } from '../../models/technical-analysis-data.model';
import { TechnicalIndicatorCalculatorService } from './technical-indicator-calculator.service';

describe('TechnicalIndicatorCalculatorService ATR', () => {
  let service: TechnicalIndicatorCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalIndicatorCalculatorService);
  });

  it('uses true range and Wilder smoothing', () => {
    const points = [
      point('2026-01-05', 10, 11, 9, 9),
      point('2026-01-06', 10, 12, 10, 11),
      point('2026-01-07', 11, 13, 9, 12),
      point('2026-01-08', 12, 14, 12, 13)
    ];

    const atr = service.atr(points, 3);

    expect(atr.length).toBe(2);
    expect(atr[0].date).toEqual(points[2].date);
    expect(atr[0].value).toBeCloseTo(3, 8);
    expect(atr[1].date).toEqual(points[3].date);
    expect(atr[1].value).toBeCloseTo(8 / 3, 8);
  });

  it('returns no values until the period is available', () => {
    const points = [
      point('2026-01-05', 10, 11, 9, 10),
      point('2026-01-06', 10, 12, 10, 11)
    ];

    expect(service.atr(points, 3)).toEqual([]);
  });
});

describe('TechnicalIndicatorCalculatorService Stochastic', () => {
  let service: TechnicalIndicatorCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalIndicatorCalculatorService);
  });

  it('calculates %K and its simple moving-average %D signal', () => {
    const points = [
      point('2026-01-05', 5, 10, 0, 5),
      point('2026-01-06', 10, 12, 2, 10),
      point('2026-01-07', 12, 14, 4, 12),
      point('2026-01-08', 15, 16, 6, 15)
    ];

    const stochastic = service.stochastic(points, 3, 2);

    expect(stochastic.length).toBe(1);
    expect(stochastic[0].date).toEqual(points[3].date);
    expect(stochastic[0].k).toBeCloseTo(650 / 7, 8);
    expect(stochastic[0].d).toBeCloseTo(625 / 7, 8);
  });

  it('returns no values before both lookback periods are available', () => {
    const points = [
      point('2026-01-05', 5, 10, 0, 5),
      point('2026-01-06', 10, 12, 2, 10),
      point('2026-01-07', 12, 14, 4, 12)
    ];

    expect(service.stochastic(points, 3, 2)).toEqual([]);
  });
});

describe('TechnicalIndicatorCalculatorService ADX', () => {
  let service: TechnicalIndicatorCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalIndicatorCalculatorService);
  });

  it('reports maximum directional strength for a steady upward series', () => {
    const points = [
      point('2026-01-05', 10, 11, 9, 10),
      point('2026-01-06', 11, 12, 10, 11),
      point('2026-01-07', 12, 13, 11, 12),
      point('2026-01-08', 13, 14, 12, 13),
      point('2026-01-09', 14, 15, 13, 14),
      point('2026-01-12', 15, 16, 14, 15)
    ];

    const adx = service.adx(points, 2);

    expect(adx.length).toBe(3);
    expect(adx[0].date).toEqual(points[3].date);
    expect(adx[0].adx).toBeCloseTo(100, 8);
    expect(adx[0].plusDi).toBeGreaterThan(0);
    expect(adx[0].minusDi).toBe(0);
  });

  it('returns no values before ADX has both smoothing windows', () => {
    const points = [
      point('2026-01-05', 10, 11, 9, 10),
      point('2026-01-06', 11, 12, 10, 11),
      point('2026-01-07', 12, 13, 11, 12)
    ];

    expect(service.adx(points, 2)).toEqual([]);
  });
});

function point(
  dateText: string,
  open: number,
  high: number,
  low: number,
  close: number
): TechnicalAnalysisDataPoint {
  const date = new Date(`${dateText}T00:00:00`);
  return {
    id: 0,
    ticker: 'TEST',
    date,
    timestamp: date,
    open,
    high,
    low,
    close,
    volume: 1_000
  };
}
