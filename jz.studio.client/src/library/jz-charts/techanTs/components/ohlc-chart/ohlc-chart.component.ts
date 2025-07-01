import { Component, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartDataService } from '../../services/chart-data.service';
import { LayoutService } from '../../services/layout.service';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None // ⬅️ important
})
export class OhlcChartComponent extends BaseChartComponent implements AfterViewInit {

  constructor(
    chartDataService: ChartDataService,
    layoutService: LayoutService
  ) {
  
    super(chartDataService, layoutService);
    this.chartType;
    console.log('%cCONSTRUCTOR', 'color: #858ae3');
  }

  override ngAfterViewInit(): void {
    console.log('%c   ✅ OhlcChartComponent ngAfterViewInit 💡', 'color:#EEF5DB',this.chartDataService);
  }

  protected  tryDrawChart(): void {
    // TODO: draw OHLC chart once size and view are ready
    console.log('%c   🟫 Drawing OHLC chart', 'color: #EEF5DB');
  }
}
