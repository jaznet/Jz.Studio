import { TestBed } from '@angular/core/testing';

import { MacdChartLayoutService } from './macd-chart-layout.service';

describe('MacdChartLayoutService', () => {
  let service: MacdChartLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacdChartLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
