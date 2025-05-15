
import { Injectable, ElementRef } from '@angular/core';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';
import { AxisLayoutRefs } from '../../parts/axis-layout';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Injectable({ providedIn: 'root' })
export class VolumeChartLayoutService extends BaseChartLayoutService {
  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs);
  }
}
