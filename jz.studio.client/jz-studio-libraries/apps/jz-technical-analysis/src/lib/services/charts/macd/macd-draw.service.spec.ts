import { TestBed } from '@angular/core/testing';

import { MacdDrawService } from './macd-draw.service';

describe('MacdChartService', () => {
  let service: MacdDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacdDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
