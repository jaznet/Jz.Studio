import { TestBed } from '@angular/core/testing';

import { RsiChart } from './rsi-chart.service';

describe('ChartRsiIndic', () => {
  let service: RsiChart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsiChart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
