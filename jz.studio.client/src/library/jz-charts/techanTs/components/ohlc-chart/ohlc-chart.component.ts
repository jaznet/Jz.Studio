import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartDataService } from '../../services/chart-data.service';
import { BaseChartComponent } from '../../services/charts/base/base-chart-component.directive';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None // ⬅️ important
})
export class OhlcChartComponent extends BaseChartComponent {
  protected chartType = ChartType.OHLC;

  constructor(
    chartDataService: ChartDataService,
    layoutService: LayoutService
  ) {
    super(chartDataService, layoutService);
  }

  protected override tryDrawChart(): void {
    // TODO: draw OHLC chart once size and view are ready
    console.log('🟫 Drawing OHLC chart');
  }
}
