import { TestBed } from '@angular/core/testing';

import { MacdChartService } from './macd-chart.service';

describe('MacdChartService', () => {
  let service: MacdChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacdChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
