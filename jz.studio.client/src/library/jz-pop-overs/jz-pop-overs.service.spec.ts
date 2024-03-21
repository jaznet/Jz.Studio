import { TestBed } from '@angular/core/testing';

import { JzPopupsService } from './jz-popups.service';

describe('JzPopupsService', () => {
  let service: JzPopupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzPopupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
