
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { OhlcChartService } from '../services/charts/ohlc/ohlc-chart.service';
import { OhlcChartLayoutService } from '../services/charts/ohlc/ohlc-chart-layout.service';
import { MacdChartComponent } from '../components/macd-chart/macd-chart.component';
import { MacdLayoutService } from '../services/charts/macd/macd-layout.service';
import { BaseChartLayoutService } from '../services/charts/base/base-chart-layout-service';

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechanTsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

 // layout!: LayoutService; // or the actual layout object if you're not using the service
  ChartType = ChartType; // expose enum to template

  // #region @ViewChild List
  @ViewChild('divSvgContainer', { static: true }) divSvgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGElement>;
  @ViewChild('rSvgElement', { static: true }) rSvgElementRef!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisTopGroup', { static: true }) xAxisTopGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRect', { static: true }) xAxisTopRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsTop', { static: true }) xAxisMonthsTopRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: true }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('xAxisBottomGroup', { static: true }) xAxisBottomGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: true }) xAxisBottomRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: true }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: true }) xAxisBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroupBottom', { static: true }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('gSectionsContainer', { static: true }) gSectionsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rSectionsContainer', { static: true }) sectionsRectRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: true }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  // #region ohlc
  @ViewChild('gOhlcSection', { static: true }) gOhlcSection!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcSection', { static: true }) rOhlcSection!: ElementRef<SVGRectElement>;
  @ViewChild('gOhlcContent', { static: true }) gOhlcContent!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcContent', { static: true }) rOhlcContent!: ElementRef<SVGRectElement>;

  @ViewChild('gOhlcChart', { static: true }) gOhlcChart!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisGroupLeft', { static: true }) gOhlcAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcAxisLeft', { static: true }) rOhlcAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gOhlcAxisLeft', { static: true }) gOhlcAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisGroupRight', { static: true }) gOhlcAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gOhlcAxisRight', { static: true }) gOhlcAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcAxisRight', { static: true }) rOhlcAxisRight!: ElementRef<SVGRectElement>;
  // #endregion ohlc

  // #region VOLUME GROUP
  @ViewChild('gVolumeSection', { static: true }) gVolumeSection!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeSection', { static: true }) rVolumeSection!: ElementRef<SVGRectElement>;
  @ViewChild('gVolumeContent', { static: true }) gVolumeContent!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeContent', { static: true }) rVolumeContent!: ElementRef<SVGRectElement>;
  @ViewChild('gVolumeChart', { static: true }) gVolumeChart!: ElementRef<SVGGElement>;

  @ViewChild('gVolumeAxisLeft', { static: true }) gVolumeAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisGroupLeft', { static: true }) gVolumeAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisLeft', { static: true }) rVolumeAxisLeft!: ElementRef<SVGRectElement>;

  @ViewChild('gVolumeAxisRight', { static: true }) gVolumeAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisGroupRight', { static: true }) gVolumeAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisRight', { static: true }) rVolumeAxisRight!: ElementRef<SVGRectElement>;
  // #endregion VOLUME GROUP gVolumeChart

  /*  #region*/
  @ViewChild('gRsiSection', { static: true }) gRsiSection!: ElementRef<SVGGElement>;
  @ViewChild('gRsiSectionContent', { static: true }) gRsiSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('rRsiSectionContent', { static: true }) rRsiSectionContent!: ElementRef<SVGRectElement>;
  @ViewChild('rRsiSectionRect', { static: true }) rRsiSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiChart', { static: true }) gRsiChart!: ElementRef<SVGGElement>;

  @ViewChild('gRsiAxisGroupLeft', { static: true }) gRsiAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rRsiAxisGroupLeft', { static: true }) rRsiAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiAxisLeft', { static: true }) gRsiAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('gRsiAxisGroupRight', { static: true }) gRsiAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rRsiAxisGroupRight', { static: true }) rRsiAxisGroupRight!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiAxisRight', { static: true }) gRsiAxisRight!: ElementRef<SVGGElement>;


  // #endregion Rsi

  // #region @VIEWCHILD lIST
  @ViewChild('sma1', { static: true }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: true }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: true }) sma3Ref!: ElementRef<SVGGElement>;

  // RSIGROUP
  @ViewChild('gRsiGroup', { static: true }) gRsiGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopOverLoadingComponent;
  // #endregion

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    public data: ChartDataService,
    public layoutService: LayoutService,
    private axes: PartsAxesService,
    public scales: ScalesService,
    private popOverService: JzPopOversService,
    private ohlcLayout: OhlcChartLayoutService,
    private volumeLayout: VolumeChartLayoutService,
    private rsiLayout: RsiChartLayoutService,
    private smaService: SmaChartService
   /* private baseLayout: BaseChartLayoutService*/
    
  ) {
    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }

  ngOnInit(): void {
    this.fetchData();
  }

  dataReady = false;
  viewReady = false;
   ticker = 'NVDA';
  ngAfterViewInit() {

    this.popover_loading.show();
    const ticker = 'NVDA';
    this.viewReady = true;
    this.tryCreateChart();
  }

  fetchData(): void {
    this.stockPriceService.getStockPrices(this.ticker).subscribe((data) => {
      this.data.stockPriceHistoryData = data;
      this.dataReady = true;
      this.tryCreateChart();
    });
  }
  

  showError(error: any) {
    this.popover_httperror.error = error.error;
    this.popover_httperror.headers = error.headers;
    this.popover_httperror.message = error.message;
    this.popover_httperror.name = error.name;
    this.popover_httperror.ok = error.ok;
    this.popover_httperror.status = error.status;
    this.popover_httperror.statusText = error.statusText;
    this.popover_httperror.url = error.url;
  }

  tryCreateChart():void {
    if (this.dataReady && this.viewReady) {
      this.createChart();
    }
  }

  createChart(): void {
    this.createChartFramework();
    setTimeout(() => {
      this.layoutService.createScaffolding(); // ✅ all views initialized now
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

    this.layoutService.sectionsContainer = this.gSectionsContainer.nativeElement;
    this.layoutService.rSectionsContainer = this.sectionsRectRef.nativeElement;

    // #region OHLC
    this.ohlcLayout.initializeSelections({
      gSection: this.gOhlcSection,
      rSection: this.rOhlcSection,
      gContent: this.gOhlcContent,
      rContent: this.rOhlcContent,
      gChart: this.gOhlcChart,

      axisLeft: {
        gAxis: this.gOhlcAxisLeft,
        gAxisGroup: this.gOhlcAxisGroupLeft,
        rAxis: this.rOhlcAxisLeft
      },
      axisRight: {
        gAxis: this.gOhlcAxisRight,
        gAxisGroup: this.gOhlcAxisGroupRight,
        rAxis: this.rOhlcAxisRight
      }
    });
    console.log('techan', this.ohlcLayout.axisLeft, this.ohlcLayout.axisRight);

    // #endregion OHLC

    // #region VOLUME

    this.volumeLayout.initializeSelections({
      gSection: this.gVolumeSection,
      rSection: this.rVolumeSection,
      gContent: this.gVolumeContent,
      rContent: this.rVolumeContent,
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
    //this.layoutService.sizeChartSection(ChartType.MACD);
 
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
      gSection: this.gRsiSection,
      rSection: this.rRsiSectionRect,
      gContent: this.gRsiSectionContent,
      rContent: this.rRsiSectionContent,
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

    this.layoutService.sma1 = this.sma1Ref.nativeElement;
    this.layoutService.sma2 = this.sma2Ref.nativeElement;
    this.layoutService.sma3 = this.sma3Ref.nativeElement;

    this.layoutService.xAxisTopGroup = this.xAxisTopGroupRef.nativeElement;
    this.layoutService.xAxisTopRect = this.xAxisTopRectRef.nativeElement;
    this.layoutService.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

    this.layoutService.xAxisBottomGroup = this.xAxisBottomGroupRef.nativeElement;
    this.layoutService.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
    this.layoutService.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;
  }

  constructChart(): void {
    this.drawCandlestick();
    this.drawVolume();
    this.drawSma1(5);
    this.drawSma2(50);
    this.drawSma3(100);
    //  this.drawMacd();
    this.drawRsi();
  }

  // #region DRAW

  drawCandlestick(): void {
   // this.ohlcChart
      //.xScale(this.scales.dateScaleX)
      ///*      .yScale(this.ohlcChart.ohlcYscale)*/
      //.setTargetGroup(this.gOhlcChart.nativeElement)
      //.setCandleWidth()
      //.drawAxes(this.layout.scaffold)
      //.draw();
  }

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
