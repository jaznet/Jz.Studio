import { Component, Input } from '@angular/core';
import { scaffold } from '../../interfaces/techan-interfaces';
import { MacdDrawService } from '../../services/charts/macd/macd-draw.service';
import { BaseChartComponent } from '../../services/charts/base/base-chart-component.directive';
import { MacdLayoutService } from '../../services/charts/macd/macd-layout.service';
import { ChartDataService } from '../../services/chart-data.service';

@Component({
  selector: 'macd-chart',
  templateUrl: './macd-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComponent extends BaseChartComponent {
  @Input() xScale!: any;
  @Input() scaffold!: scaffold;


  private chartReady: boolean = false;

  constructor(
    private macdDraw: MacdDrawService,
    private macdLayout: MacdLayoutService,
      dataService: ChartDataService
  ) {
    super(dataService);
  }

  override ngAfterViewInit(): void {
    const refs = this.buildRefs();
    this.macdLayout.initializeBase(refs, 'macd');
    super.ngAfterViewInit(); // 👈 This explicitly runs the base class logic
  }


  override tryDrawChart(): void {
    if (!this.viewReady || !this.dataService || !this.scaffold || !this.xScale) return;

    this.macdDraw
      .setTargetGroup(this.gChartRef.nativeElement)
      .xScale(this.xScale)
      .setPeriods(12, 26, 9)
      .drawAxes(this.scaffold)
      .draw();

    this.chartReady = true;
  }

  // Optional: add setter methods if you want runtime changes to re-trigger rendering
}
