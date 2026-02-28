import { Injectable } from '@angular/core';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { ChartType } from '../../../enums/chart-type';

@Injectable({
  providedIn: 'root'
})
export class MacdLayoutService extends BaseChartLayoutService {
    protected override chartType!: ChartType;
    protected override setSize(width: number, height: number): void {
        throw new Error('Method not implemented.');
    }
  // Optional future customization
}
