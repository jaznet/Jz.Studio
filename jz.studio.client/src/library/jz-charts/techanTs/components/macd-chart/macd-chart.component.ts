import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { scaffold } from '../../interfaces/techan-interfaces';
import { MacdDrawService } from '../../services/charts/macd/macd-draw.service';
import { BaseChartComponent } from '../../services/charts/base/base-chart-component.directive';
import { MacdLayoutService } from '../../services/charts/macd/macd-layout.service';
import { ChartDataService } from '../../services/chart-data.service';
import { LayoutService } from '../../services/layout.service';
/*import { interpolateBlues } from 'd3';*/

@Component({
  selector: 'macd-chart',
  templateUrl: './macd-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComp extends BaseChartComponent implements  AfterViewInit {

  @Input() xScale!: any;
  @Input() scaffold!: scaffold;

/*  @ViewChild('rMacdContent', { static: false }) rMacdContent!: ElementRef<SVGRectElement>;*/

  private chartReady: boolean = false;

  constructor(
    private macdDraw: MacdDrawService,
    private macdLayout: MacdLayoutService,
     layoutService: LayoutService,
 dataService: ChartDataService
  ) {
    super(dataService, layoutService);
  }

  //ngOnInit(): void {
  ////  console.log('🔧 MacdChartComp ngOnInit');
  //}

  override ngAfterViewInit(): void {
    console.log('%c✅ MacdChartComp ngAfterViewInit 💡', 'color:yellow');
    this.isViewInitialized = true;
    // Set width and height on root rect
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
