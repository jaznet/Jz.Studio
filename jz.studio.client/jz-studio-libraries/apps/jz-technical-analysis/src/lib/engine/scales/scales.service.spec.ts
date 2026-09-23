import { TestBed } from '@angular/core/testing';

import { _ScalesService } from './scales.service';

describe('ScalesService', () => {
  let service: _ScalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(_ScalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
