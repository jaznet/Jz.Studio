import { TestBed } from '@angular/core/testing';

import { RsiIndicatorService } from './rsi-indicator.service';

describe('RsiIndicatorService', () => {
  let service: RsiIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsiIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
