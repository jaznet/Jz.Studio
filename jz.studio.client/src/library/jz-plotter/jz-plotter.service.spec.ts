import { TestBed } from '@angular/core/testing';

import { JzPlotterService } from './jz-plotter.service';

describe('JzPlotterService', () => {
  let service: JzPlotterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzPlotterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
