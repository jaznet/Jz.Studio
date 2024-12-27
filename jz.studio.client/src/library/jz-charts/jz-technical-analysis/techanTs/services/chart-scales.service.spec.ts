import { TestBed } from '@angular/core/testing';

import { ChartScalesService } from './chart-scales.service';

describe('ChartScalesService', () => {
  let service: ChartScalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartScalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
