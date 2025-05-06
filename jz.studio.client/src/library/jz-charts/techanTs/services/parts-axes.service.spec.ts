import { TestBed } from '@angular/core/testing';

import { PartsAxesService } from './parts-axes.service';

describe('PartsAxesService', () => {
  let service: PartsAxesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartsAxesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
