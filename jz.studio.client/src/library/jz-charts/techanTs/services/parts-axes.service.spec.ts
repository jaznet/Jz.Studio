import { TestBed } from '@angular/core/testing';

import { _PartsAxesService } from './parts-axes.service';

describe('PartsAxesService', () => {
  let service: _PartsAxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(_PartsAxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
