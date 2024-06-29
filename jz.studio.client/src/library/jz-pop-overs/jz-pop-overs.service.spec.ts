import { TestBed } from '@angular/core/testing';

import { JzPopOversService } from '../jz-pop-overs/jz-pop-overs.service';

describe('JzPopupsService', () => {
  let service: JzPopOversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzPopOversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
