import { TestBed } from '@angular/core/testing';

import { JzMenuService } from './jz-menu.service';

describe('JzMenuService', () => {
  let service: JzMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
