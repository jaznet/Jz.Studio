import { TestBed } from '@angular/core/testing';

import { RsiChartLayoutService } from './rsi-chart-layout.service';

describe('RsiChartLayoutService', () => {
  let service: RsiChartLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsiChartLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
