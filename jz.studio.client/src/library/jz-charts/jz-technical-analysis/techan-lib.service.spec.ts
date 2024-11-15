import { TestBed } from '@angular/core/testing';

import { TechanLibService } from './techan-lib.service';

describe('TechanLibService', () => {
  let service: TechanLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechanLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
