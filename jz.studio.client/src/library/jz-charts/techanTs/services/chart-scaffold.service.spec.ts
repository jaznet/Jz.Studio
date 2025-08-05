import { TestBed } from '@angular/core/testing';

import { _ChartScaffoldService } from './chart-scaffold.service';

describe('ChartScaffoldService', () => {
  let service: _ChartScaffoldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(_ChartScaffoldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
