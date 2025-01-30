import { TestBed } from '@angular/core/testing';

import { OhlcChartService } from './ohlc-chart.service';

describe('OhlcChartService', () => {
  let service: OhlcChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhlcChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
