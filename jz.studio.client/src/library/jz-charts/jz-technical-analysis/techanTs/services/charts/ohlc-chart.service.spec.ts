import { TestBed } from '@angular/core/testing';

import { OhlcChartService } from './chart.ohlc-service';

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
