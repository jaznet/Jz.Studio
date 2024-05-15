import { TestBed } from '@angular/core/testing';

import { SpirographService } from './spirograph.service';

describe('SpirographService', () => {
  let service: SpirographService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpirographService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
