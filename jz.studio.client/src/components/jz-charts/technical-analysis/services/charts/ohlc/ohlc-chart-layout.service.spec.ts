import { TestBed } from '@angular/core/testing';

import { OhlcChartLayoutService } from './ohlc-chart-layout.service';

describe('OhlcChartLayoutService', () => {
  let service: OhlcChartLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhlcChartLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
