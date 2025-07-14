import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { scaffold } from '../../interfaces/techan-interfaces';
import { MacdDrawService } from '../../services/charts/macd/macd-draw.service';
import { MacdLayoutService } from '../../services/charts/macd/macd-layout.service';
import { ChartDataService } from '../../services/chart-data.service';
import { LayoutService } from '../../services/layout.service';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ScalesService } from '../../services/scales.service';
/*import { interpolateBlues } from 'd3';*/

@Component({
  selector: 'macd-chart',
  templateUrl: './macd-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComp  implements  AfterViewInit {

  private chartReady: boolean = false;

  constructor(
    private macdDraw: MacdDrawService,
    private macdLayout: MacdLayoutService,
    layoutService: LayoutService,
    dataService: ChartDataService,
    scales: ScalesService
  ) {
    console.log('%c⛏️ XTOR MacdChartComp', 'color: #D07676');
  }

   ngAfterViewInit(): void {
     console.log('%c 🟠 ngAfterViewInit MACD', 'color:#D07676');
  }

   tryDrawChart(): void {
/*    if (!this.viewReady || !this.dataService || !this.scaffold || !this.xScale) return;*/

   // this.macdDraw
   ////   .setTargetGroup(this.gChartContainerRef.nativeElement)
   //   .xScale(this.xScale)
   //   .setPeriods(12, 26, 9)
   //   .drawAxes(this.scaffold)
   //   .draw();

    this.chartReady = true;
  }



  // Optional: add setter methods if you want runtime changes to re-trigger rendering
}
