import { TestBed } from '@angular/core/testing';

import { ChoroUtilsService } from './choro-utils.service';

describe('ChoroUtilsService', () => {
  let service: ChoroUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoroUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
