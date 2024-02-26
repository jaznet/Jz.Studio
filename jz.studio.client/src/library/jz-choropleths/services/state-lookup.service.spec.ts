import { TestBed } from '@angular/core/testing';

import { StateLookupService } from './state-lookup.service';

describe('StateLookupService', () => {
  let service: StateLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
