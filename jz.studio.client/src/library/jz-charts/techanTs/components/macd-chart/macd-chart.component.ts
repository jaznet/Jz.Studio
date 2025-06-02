import { Component, AfterViewInit, Input, ElementRef, ViewChild } from '@angular/core';
import { scaffold } from '../../interfaces/techan-interfaces';
import { MacdChartService } from '../../services/charts/macd/macd-chart.service';
import { BaseChartComponent } from '../../services/charts/base/base-chart-component.directive';
import { LayoutService } from '../../services/layout.service';
import { BaseChartLayoutService } from '../../services/charts/base/base-chart-layout-service';
import { MacdLayoutService } from '../../services/charts/macd/macd-layout.service';

@Component({
  selector: 'macd-chart',
  templateUrl: './macd-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComponent extends BaseChartComponent implements AfterViewInit {
  @Input() xScale!: any;
  @Input() scaffold!: scaffold;
  @Input() data!: any[];

  constructor(
    private macdChart: MacdChartService,
    private layout: MacdLayoutService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    const refs = this.buildRefs();
    this.layout.initializeBase(refs, 'macd'); // or inline the logic here
    this.macdChart
      .setTargetGroup(this.gChartRef.nativeElement)
      .setData(this.data)
      .xScale(this.xScale)
      .setPeriods(12, 26, 9)
      .drawAxes(this.scaffold)
      .draw();
  }
}
