import { TestBed } from '@angular/core/testing';

import { CountyDataService } from './county-data.service';

describe('CountyDataService', () => {
  let service: CountyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
