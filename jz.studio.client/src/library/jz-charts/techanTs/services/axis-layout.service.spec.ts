import { TestBed } from '@angular/core/testing';

import { AxisLayoutService } from './axis-layout.service';

describe('AxisLayoutService', () => {
  let service: AxisLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxisLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
