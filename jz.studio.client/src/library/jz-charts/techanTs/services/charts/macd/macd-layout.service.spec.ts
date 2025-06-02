import { TestBed } from '@angular/core/testing';

import { MacdLayoutService } from './macd-layout.service';

describe('MacdLayoutService', () => {
  let service: MacdLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacdLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
