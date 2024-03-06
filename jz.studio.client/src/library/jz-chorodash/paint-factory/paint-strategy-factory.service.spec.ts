import { TestBed } from '@angular/core/testing';

import { PaintStrategyFactoryService } from './paint-strategy-factory.service';

describe('PaintStrategyFactoryService', () => {
  let service: PaintStrategyFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaintStrategyFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
