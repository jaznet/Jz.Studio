
import { Injectable, ElementRef } from '@angular/core';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';
import { AxisLayoutRefs } from '../../parts/axis-layout';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { ChartType } from '../../../enums/chart-type';

@Injectable({ providedIn: 'root' })
export class VolumeChartLayoutService extends BaseChartLayoutService {
  protected override chartType!: ChartType;
  protected override setSize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }

  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs,'volume');
  }
}
