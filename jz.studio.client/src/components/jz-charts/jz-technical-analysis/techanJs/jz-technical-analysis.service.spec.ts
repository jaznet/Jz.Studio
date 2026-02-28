import { TestBed } from '@angular/core/testing';

import { JzTechnicalAnalysisService } from './jz-technical-analysis.service';

describe('JzTechnicalAnalysisService', () => {
  let service: JzTechnicalAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzTechnicalAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
