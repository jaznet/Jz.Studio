import { TestBed } from '@angular/core/testing';

import { ChoroDataService } from './choro-data.service';

describe('ChoroDataService', () => {
  let service: ChoroDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoroDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
