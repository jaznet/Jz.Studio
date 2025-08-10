import { TestBed } from '@angular/core/testing';

import { ChartScaffoldService } from './chart-scaffold.service';

describe('ChartScaffoldService', () => {
  let service: ChartScaffoldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartScaffoldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
