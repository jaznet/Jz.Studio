import { TestBed } from '@angular/core/testing';


import { TechanTsService } from './techanTs.service';

describe('JzTechnicalAnalysisService', () => {
  let service: TechanTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechanTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
