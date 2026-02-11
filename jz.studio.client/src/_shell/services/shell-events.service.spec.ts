import { TestBed } from '@angular/core/testing';

import { ShellEventsService } from './shell-events.service';

describe('AppEventsService', () => {
  let service: ShellEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
