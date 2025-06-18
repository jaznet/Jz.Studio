import { Injectable } from '@angular/core';
import { ChartType } from '../../../enums/chart-type';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Injectable({
  providedIn: 'root'
})
export class OhlcChartLayoutService extends BaseChartLayoutService {
  protected chartType: ChartType = ChartType.OHLC;

  protected setSize(width: number, height: number): void {
    console.log('📐 OhlcChartLayoutService.setSize()', width, height);

    this.rSection.attr('width', width);
    this.rSection.attr('height', height);
    this.rContent.attr('width', width);
    this.rContent.attr('height', height);

    // Optionally adjust axis layout or internal elements
  }

  initializeSelections(refs: ChartElementRefs): void {
    this.initializeBase(refs, 'OHLC');
  }
}
