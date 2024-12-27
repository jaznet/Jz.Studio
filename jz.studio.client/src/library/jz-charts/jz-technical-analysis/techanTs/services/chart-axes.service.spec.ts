import { TestBed } from '@angular/core/testing';

import { ChartAxesService } from './chart-axes.service';

describe('ChartAxesService', () => {
  let service: ChartAxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartAxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
