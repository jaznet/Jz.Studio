import { TestBed } from '@angular/core/testing';

import { VolumeChartLayoutService } from './volume-chart-layout.service';

describe('VolumeChartLayoutService', () => {
  let service: VolumeChartLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumeChartLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
