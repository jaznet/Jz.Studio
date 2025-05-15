import { Injectable, ElementRef } from '@angular/core';
import { AxisLayoutRefs } from '../../parts/axis-layout';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';

@Injectable({ providedIn: 'root' })
export class RsiChartLayoutService extends BaseChartLayoutService {
  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs);
  }
}
