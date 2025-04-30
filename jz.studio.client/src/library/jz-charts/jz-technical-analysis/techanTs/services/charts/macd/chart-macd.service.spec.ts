import { TestBed } from '@angular/core/testing';

import { ChartMacdService } from './chart-macd.service';

describe('MacdChartService', () => {
  let service: ChartMacdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartMacdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
