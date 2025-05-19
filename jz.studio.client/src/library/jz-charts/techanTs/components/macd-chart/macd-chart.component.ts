import { Component, AfterViewInit, Input } from "@angular/core";
import { scaffold } from "../../interfaces/techan-interfaces";
import { BaseChartComponent } from "../../services/charts/base/base-chart-component.directive";
import { MacdChartLayoutService } from "../../services/charts/macd/macd-chart-layout.service";
import { MacdChartService } from "../../services/charts/macd/macd-chart.service";

@Component({
  selector: 'macd-chart',
  templateUrl: './macd-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComponent extends BaseChartComponent implements AfterViewInit {
  @Input() xScale!: any;
  @Input() scaffold!: scaffold;  // 👈 comes from parent layout
  @Input() data!: any[];         // optional: pass parsed macdData

  constructor(
    private macdLayout: MacdChartLayoutService,
    private macdChart: MacdChartService
  ) { super(); }

  ngAfterViewInit(): void {
    this.macdLayout.initializeSelections(this.buildRefs());

    this.macdChart
      .xScale(this.xScale)
      .setTargetGroup(this.gChartRef.nativeElement)
      .setPeriods(12, 26, 9)
      .drawAxes(this.scaffold)
      .draw();
  }
}
