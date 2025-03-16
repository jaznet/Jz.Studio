import { TestBed } from '@angular/core/testing';

import { VolumeChartService } from './chart-volume.service';

describe('VolumeChartService', () => {
  let service: VolumeChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumeChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
