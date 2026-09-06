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
