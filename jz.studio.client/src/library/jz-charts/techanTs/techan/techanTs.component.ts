
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators'; // ✅ add this
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { ohlcData, scaffold, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';
import { ChartDataService } from '../services/chart-data.service';
import { ChartType } from '../enums/chart-type'; // adjust the path as needed
import { LayoutService } from '../services/layout.service';
import { PartsAxesService } from '../services/parts-axes.service';
import { ScalesService } from '../services/scales.service';
import { select, selection, selectAll } from 'd3-selection';
import { SmaChartService } from '../services/charts/chart-sma.service';
import { MacdDrawService } from '../services/charts/macd/macd-draw.service';
import { RsiChart } from '../services/charts/rsi/rsi-chart.service';
import { RsiChartLayoutService } from '../services/charts/rsi/rsi-chart-layout.service';
import { PopoverHttpErrorComponent } from '../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { StockPriceHistory } from '../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../jz-pop-overs/jz-pop-overs.service';
import { PopOverLoadingComponent } from '../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { VolumeChartService } from '../services/charts/volume/volume-chart.service';
import { VolumeChartLayoutService } from '../services/charts/volume/volume-chart-layout.service';
import { OhlcChartLayoutService } from '../services/charts/ohlc/ohlc-chart-layout.service';
import { MacdChartComp } from '../components/macd-chart/macd-chart.component';
import { MacdLayoutService } from '../services/charts/macd/macd-layout.service';
import { OhlcChartComponent } from '../components/ohlc-chart/ohlc-chart.component';

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechanTsComponent  implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

 // layout!: LayoutService; // or the actual layout object if you're not using the service
  ChartType = ChartType; // expose enum to template

  // #region @ViewChild List
  @ViewChild('divSvgContainer', { static: false }) divSvgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGElement>;
  @ViewChild('rSvgElement', { static: false }) rSvgElementRef!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisTopGroup', { static: false }) xAxisTopGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRect', { static: false }) xAxisTopRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsTop', { static: false }) xAxisMonthsTopRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: false }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('xAxisBottomGroup', { static: false }) xAxisBottomGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: false }) xAxisBottomRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: false }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: false }) xAxisBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroupBottom', { static: false }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('gSectionsContainer', { static: false }) gSectionsContainerRef!: ElementRef<SVGGElement>;
  @ViewChild('rSectionsContainer', { static: false }) rSectionsContainerRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: false }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  // #region ohlc
  @ViewChild('ohlcChart', { static: false }) ohlcChartRef!: OhlcChartComponent;
  ohlcChartComponent!: OhlcChartComponent;

  @ViewChild('gOhlcSection', { static: false }) gOhlcSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcSection', { static: false }) rOhlcSectionRef!: ElementRef<SVGRectElement>;
  @ViewChild('gOhlcContent', { static: false }) gOhlcContent!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcContent', { static: false }) rOhlcContent!: ElementRef<SVGRectElement>;

  @ViewChild('gOhlcChart', { static: false }) gOhlcChart!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisGroupLeft', { static: false }) gOhlcAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcAxisLeft', { static: false }) rOhlcAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gOhlcAxisLeft', { static: false }) gOhlcAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisGroupRight', { static: false }) gOhlcAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gOhlcAxisRight', { static: false }) gOhlcAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcAxisRight', { static: false }) rOhlcAxisRight!: ElementRef<SVGRectElement>;
  // #endregion ohlc

  // #region VOLUME GROUP
  @ViewChild('gVolumeSection', { static: false }) gVolumeSection!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeSection', { static: false }) rVolumeSection!: ElementRef<SVGRectElement>;
  @ViewChild('gVolumeContent', { static: false }) gVolumeContent!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeContent', { static: false }) rVolumeContent!: ElementRef<SVGRectElement>;
  @ViewChild('gVolumeChart', { static: false }) gVolumeChart!: ElementRef<SVGGElement>;

  @ViewChild('gVolumeAxisLeft', { static: false }) gVolumeAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisGroupLeft', { static: false }) gVolumeAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisLeft', { static: false }) rVolumeAxisLeft!: ElementRef<SVGRectElement>;

  @ViewChild('gVolumeAxisRight', { static: false }) gVolumeAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisGroupRight', { static: false }) gVolumeAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisRight', { static: false }) rVolumeAxisRight!: ElementRef<SVGRectElement>;
  // #endregion VOLUME GROUP gVolumeChart

  // #region MACD
  //@ViewChild('rMacdContent', { static: false }) rMacdContent!: ElementRef<SVGRectElement>;
  // #endregion MACD

  // #region RSI
  @ViewChild('gRsiSection', { static: false }) gRsiSection!: ElementRef<SVGGElement>;
  @ViewChild('gRsiSectionContent', { static: false }) gRsiSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('rRsiSectionContent', { static: false }) rRsiSectionContent!: ElementRef<SVGRectElement>;
  @ViewChild('rRsiSectionRect', { static: false }) rRsiSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiChart', { static: false }) gRsiChart!: ElementRef<SVGGElement>;

  @ViewChild('gRsiAxisGroupLeft', { static: false }) gRsiAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rRsiAxisGroupLeft', { static: false }) rRsiAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiAxisLeft', { static: false }) gRsiAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('gRsiAxisGroupRight', { static: false }) gRsiAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rRsiAxisGroupRight', { static: false }) rRsiAxisGroupRight!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiAxisRight', { static: false }) gRsiAxisRight!: ElementRef<SVGGElement>;
  // #endregion Rsi

  // #region @VIEWCHILD lIST
  @ViewChild('sma1', { static: false }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: false }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: false }) sma3Ref!: ElementRef<SVGGElement>;

  // RSIGROUP
  @ViewChild('gRsiGroup', { static: false }) gRsiGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('popover_httperror', { static: false }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: false }) popover_loading!: PopOverLoadingComponent;
  // #endregion

  dataReady = false;
  viewReady = false;
  hydrated = false; // Optional safety to prevent double-draw
  ticker = 'NVDA';

  @ViewChild('macdChart', { static: false }) macdChart!: MacdChartComp;

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    public data: ChartDataService,
    public  layoutService: LayoutService,
    private axes: PartsAxesService,
    public scales: ScalesService,
    private popOverService: JzPopOversService,
    private ohlcLayout: OhlcChartLayoutService,
    private volumeLayout: VolumeChartLayoutService,
    private rsiLayout: RsiChartLayoutService,
    private smaService: SmaChartService,
/*    private ohlcChart: OhlcChartComponent,*/
    private macdLayout: MacdLayoutService,
    private macdDraw: MacdDrawService
   /* private baseLayout: BaseChartLayoutService*/
    
  ) {
  
    console.log('%cCONSTRUCTOR', 'color: #858ae3');
    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
 
    this.fetchData();
    console.log('%c✅ TechanTsComponent ngAfterViewInit() 💡', 'color:#858ae3');
  //  this.popover_loading.show();
    const ticker = 'NVDA';
    this.viewReady = true;
   
    // Delay tryCreateChart slightly to ensure <macd-chart> ViewChild is resolved
      setTimeout(() => this.tryCreateChart());
    //this.createChartFramework();
  }

 

  fetchData(): void {
    this.popover_loading.show();
    this.stockPriceService.getStockPrices(this.ticker).subscribe((data) => {
      this.data.stockPriceHistoryData = data;
      this.dataReady = true;
      console.log('%c✅ DATA FETCHED 💡', 'color:yellow');
      this.popover_loading.hide();
      this.tryCreateChart();
    },
      (error) => {
        this.showError(error);
      }
    );
  }

  showError(error: any) {
    this.popover_loading.hide();
    this.popover_httperror.error = error.error;
    this.popover_httperror.headers = error.headers;
    this.popover_httperror.message = error.message;
    this.popover_httperror.name = error.name;
    this.popover_httperror.ok = error.ok;
    this.popover_httperror.status = error.status;
    this.popover_httperror.statusText = error.statusText;
    this.popover_httperror.url = error.url;
    this.popover_httperror.show();
  }

  tryCreateChart(): void {
    if (this.viewReady && this.dataReady && !this.hydrated) {
      this.hydrated = true;
      this.createChartFramework();             // Build framework refs immediatelyfetch
      this.changeDetector.detectChanges(); // Push any binding updates
      this.initializeChartWhenReady();     // ✅ Start safe chart initialization
    }
  }

  initializeChartWhenReady(attempt = 0): void {

    if (!this.viewReady || !this.dataReady) return;

    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      if (!this.macdChart) {
        if (attempt < 10) {
          console.warn(`⏳ Waiting for macdChart to be created... (attempt ${attempt})`);
          setTimeout(() => this.initializeChartWhenReady(attempt + 1), 50);
        } else {
          console.error('❌ macdChart still not available after 10 attempts.');
        }
        return;
      }

      //if (!this.macdChart.isViewInitialized) {
      //  console.warn('⚠️ macdChart is not fully initialized yet. Retrying...');
      //  setTimeout(() => this.initializeChartWhenReady(attempt + 1), 50);
      //  return;
      //}

      // ✅ All good — proceed
  //    this.macdLayout.initializeBase(this.macdChart.buildRefs(), 'macd');
      this.layoutService.createScaffolding();
      this.data.scrubData();
      this.scales.createScales(this.layoutService.scaffold);
      this.axes.drawAxes();
      this.constructChart();
    });
  }

  createChartFramework() {
 
    this.layoutService.divSvgContainer = select(this.divSvgContainer.nativeElement);
    this.layoutService.svgElement = select(this.svgElement.nativeElement);
    this.layoutService.rSvgElement = select(this.rSvgElementRef.nativeElement);

    this.layoutService.gSectionsContainer = select(this.gSectionsContainerRef.nativeElement);
    this.layoutService.rSectionsContainer = select(this.rSectionsContainerRef.nativeElement);

  //  this.layoutService.rSectionsContainer = this.rs.nativeElement;

    this.layoutService.rOhlcSection = select(this.rOhlcSectionRef.nativeElement);
    console.log('%c✅ CREATE CHART FRAMEWORK', 'color:#858ae3');
 //   this.layoutService.rMacdSection = select(this.rMacd)
 
    // #region OHLC
    //this.  ohlcLayout.initializeSelections({
    //  gChartContainer: this.gOhlcSection,
    //  rSection: this.rOhlcSection,
    //  gContent: this.gOhlcContent,
    //  rContent: this.rOhlcContent,
    //  gChart: this.gOhlcChart,

    //  axisLeft: {
    //    gAxis: this.gOhlcAxisLeft,
    //    gAxisGroup: this.gOhlcAxisGroupLeft,
    //    rAxis: this.rOhlcAxisLeft
    //  },
    //  axisRight: {
    //    gAxis: this.gOhlcAxisRight,
    //    gAxisGroup: this.gOhlcAxisGroupRight,
    //    rAxis: this.rOhlcAxisRight
    //  }
    //});

    // #endregion OHLC

    // #region VOLUME

    this.volumeLayout.initializeSelections({
      gContainer: this.gVolumeSection,
      rContainer: this.rVolumeSection,
      //gContent: this.gVolumeContent,
      //rContent: this.rVolumeContent,
      gChart: this.gVolumeChart,

      axisLeft: {
        gAxis: this.gVolumeAxisLeft,
        gAxisGroup: this.gVolumeAxisGroupLeft,
        rAxis: this.rVolumeAxisLeft
      },
      axisRight: {
        gAxis: this.gVolumeAxisRight,
        gAxisGroup: this.gVolumeAxisGroupRight,
        rAxis: this.rVolumeAxisRight
      }
    });

    // #endregion VOLUME

    // #region MACD
   // this.layoutService.rMacdContent = this.rMacdContent.nativeElement;
//    console.log('%csetSize', this.layoutService.scaffold.sections[ChartType.MACD]?.width);
 //   this.macdChart.setSize(this.layoutService.scaffold.sections[ChartType.MACD]?.width ?? 0, this.layoutService.scaffold.sections[ChartType.MACD]?.height ?? 0)
 
    //this.baseLayout.initializeBase({
    //  gSection: this.gMacdSection,
    //  rSection: this.rMacdSectionRect,
    //  gContent: this.gMacdContent,
    //  rContent: this.rMacdContentRect,
    //  gChart: this.gMacdChart,
    //  axisLeft: {
    //    gAxis: this.gMacdAxisLeft,
    //    gAxisGroup: this.gMacdAxisGroupLeft,
    //    rAxis: this.rMacdAxisLeft
    //  },
    //  axisRight: {
    //    gAxis: this.gMacdAxisRight,
    //    gAxisGroup: this.gMacdAxisGroupRight,
    //    rAxis: this.rMacdAxisRight
    //  }
    //}, 'macd');

    // #rendegion MACD

    //#region RSI
    this.rsiLayout.initializeSelections({
      gContainer: this.gRsiSection,
      rContainer: this.rRsiSectionRect,
    
      gChart: this.gRsiChart, // if used as the chart base

      axisLeft: {
        gAxis: this.gRsiAxisLeft,
        gAxisGroup: this.gRsiAxisGroupLeft,
        rAxis: this.rRsiAxisGroupLeft
      },
      axisRight: {
        gAxis: this.gRsiAxisRight,
        gAxisGroup: this.gRsiAxisGroupRight,
        rAxis: this.rRsiAxisGroupRight
      }
    });
    //#endregion RSI

    //this.layoutService.sma1 = this.sma1Ref.nativeElement;
    //this.layoutService.sma2 = this.sma2Ref.nativeElement;
    //this.layoutService.sma3 = this.sma3Ref.nativeElement;

    this.layoutService.xAxisTopGroup = this.xAxisTopGroupRef.nativeElement;
    this.layoutService.xAxisTopRect = this.xAxisTopRectRef.nativeElement;
    this.layoutService.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

    this.layoutService.xAxisBottomGroup = this.xAxisBottomGroupRef.nativeElement;
    this.layoutService.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
    this.layoutService.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;
  }

  constructChart(): void {
 //   this.drawOhlc();
    this.drawVolume();
    this.drawSma1(5);
    this.drawSma2(50);
    this.drawSma3(100);
    //  this.drawMacd();
    this.drawRsi();
  }

  // #region DRAW

  //drawOhlc(): void {
  //  this.ohlcChartRef.tryDrawWhenReady();
  //  //   this.ohlcChartRef.draw();
  //  //this.ohlcChartRef
  //  //  .xScale(this.scales.dateScaleX)
  //  //        .yScale(this.ohlcChart.ohlcYscale)
  //  //  .setTargetGroup(this.gOhlcChart.nativeElement)
  //  //  .setCandleWidth()
  //  //  .drawAxes(this.layoutService.scaffold)
  //  //  .draw();
  //}

  drawVolume(): void {
    //this.volumeChart
    //  .xScale(this.scales.dateScaleX)
    //  /*    .yScale(this.gVolumeChart.volumeYscale)*/
    //  .setTargetGroup(this.gVolumeContent.nativeElement)
    //  .setBarWidth()
    //  .drawAxes(this.layout.scaffold)
    //  .draw();
  }

  //drawMacd(): void {
  //  this.macdChart
  //    .xScale(this.scales.dateScaleX)
  //    .setTargetGroup(this.macdLayout.gChart)
  //    .setPeriods(12, 26, 9) // Typical MACD periods
  //    .drawAxes(this.layout.scaffold)
  //    .draw();
  //}

  drawSma1(period: number): void {
    this.smaService
      .xScale(this.scales.dateScaleX)
      /*.yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layoutService.sma1) // Specify target group
      .setRollingPeriod(period)
      .setColor('#4E59D0')
      .draw();
  }

  drawSma2(period: number): void {
    this.smaService
      .xScale(this.scales.dateScaleX)
      /*   .yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layoutService.sma2) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#F1FEC6')
      .draw();
  }

  drawSma3(period: number): void {
    this.smaService
      .xScale(this.scales.dateScaleX)
      /*   .yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layoutService.sma3) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#ff3a20')
      .draw();
  }

  drawRsi(): void {
  //  this.rsiChart
  //    .xScale(this.scales.dateScaleX)
  //    /* .yScale(this.scales.rsiYscale)*/
  //    .setTargetGroup(this.rsiLayout.gChart) // Define a <g> for RSI
  //    .setRollingPeriod(14) // Optional: Change the period
  //    .drawAxes(this.layout.scaffold)
  //    .draw();
  }
  // #endregion DRAW
}
