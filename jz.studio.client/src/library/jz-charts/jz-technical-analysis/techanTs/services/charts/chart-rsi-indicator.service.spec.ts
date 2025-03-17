import { TestBed } from '@angular/core/testing';

import { ChartRsiIndic } from './chart-rsi-indicator.service';

describe('ChartRsiIndic', () => {
  let service: ChartRsiIndic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartRsiIndic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
