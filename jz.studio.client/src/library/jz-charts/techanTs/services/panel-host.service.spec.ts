import { TestBed } from '@angular/core/testing';

import { PanelHostService } from './panel-host.service';

describe('PanelHostService', () => {
  let service: PanelHostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
