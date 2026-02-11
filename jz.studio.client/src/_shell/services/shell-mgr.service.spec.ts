import { TestBed } from '@angular/core/testing';

import { AppMgrService } from './shell-mgr.service';

describe('AppMgrService', () => {
  let service: AppMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
