import { TestBed } from '@angular/core/testing';

import { SmaChartService } from './sma-chart.service';

describe('SmaChartService', () => {
  let service: SmaChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmaChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
