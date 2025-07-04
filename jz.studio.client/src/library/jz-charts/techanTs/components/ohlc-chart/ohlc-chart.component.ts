
import { Component } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { LayoutService } from '../../services/layout.service';
import { take } from 'rxjs';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html', // 🔥 Shared base template
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent extends BaseChartComponent {

  constructor(
    protected override dataService: ChartDataService,
    protected override layoutService: LayoutService
  ) {
    super(dataService, layoutService);
  }

  override ngAfterViewInit(): void {
    this.layoutService.ohlcSizeReady$.pipe(take(1)).subscribe(({ width, height }) => {
      this.setSize(width, height);
    });
    this.viewReady = true;
    this.tryDrawChart();
  }

  protected override tryDrawChart(): void {
    if (!this.viewReady || !this.dataService.stockPriceHistoryData?.length) return;

    console.log('%c🕯️ Drawing OHLC Chart', 'color:orange');
    // You can insert D3 logic here targeting:
    // this.gChartRef.nativeElement
  }
}
