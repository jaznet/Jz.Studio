import { Injectable, ElementRef } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';

@Injectable({ providedIn: 'root' })
export class MacdChartLayoutService extends BaseChartLayoutService {
  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs);
  }
}
