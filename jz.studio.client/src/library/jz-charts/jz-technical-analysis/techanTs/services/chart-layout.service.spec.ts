import { TestBed } from '@angular/core/testing';

import { ChartLayoutService } from './chart-layout.service';

describe('ChartLayoutService', () => {
  let service: ChartLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
