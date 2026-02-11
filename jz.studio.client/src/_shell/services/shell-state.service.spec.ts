import { TestBed } from '@angular/core/testing';

import { AppStateService } from './shell-state.service';

describe('AppServiceService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
