import { Injectable, ElementRef } from '@angular/core';
import { BaseChartLayoutService } from '../base-chart-layout-service';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Injectable({ providedIn: 'root' })
export class MacdChartLayoutService extends BaseChartLayoutService {
  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs);
  }
}
