import { TestBed } from '@angular/core/testing';

import { ChartInjectionService } from './chart-injection.service';

describe('ChartInjectionService', () => {
  let service: ChartInjectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartInjectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
