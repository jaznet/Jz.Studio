
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { ohlcData, SectionAttributes } from '../interfaces/techan-interfaces';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../../jz-pop-overs/jz-pop-overs.service';
import { ChartDataService } from '../services/chart-data.service';
import { LayoutService } from '../services/layout.service';
import { PartsAxesService } from '../services/parts-axes.service';
import { ScalesService } from '../services/scales.service';
import { select, selection, selectAll } from 'd3-selection';
import { VolumeChartService } from '../services/charts/chart-volume.service';
import { ChartOhlcService } from '../services/charts/chart-ohlc.service';
import { SmaChartService } from '../services/charts/chart-sma.service';
import { ChartMacdService } from '../services/charts/chart-macd.service';
import { ChartRsiIndic } from '../services/charts/chart-rsi-indicator.service';

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.css'] 
})
export class TechanTsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  // #region @ViewChild List
  @ViewChild('svgContainer', { static: true }) svgContainerRef!: ElementRef;
  @ViewChild('svgElement', { static: true }) svgElementRef!: ElementRef;
  @ViewChild('svgElementRect', { static: true }) svgElementRectRef!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisGroupBottom', { static: true }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('sections', { static: true }) sectionsRef!: ElementRef<SVGGElement>;
  @ViewChild('sectionsContainerRect', { static: true }) sectionsRectRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: true }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  // #region ohlc
  @ViewChild('ohlcSection', { static: true }) ohlcSection!: ElementRef<SVGGElement>;
  @ViewChild('ohlcSectionRect', { static: true }) ohlcSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('ohlcSectionContent', { static: true }) ohlcSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('ohlcSectionContentRect', { static: true }) ohlcSectionContentRect!: ElementRef<SVGRectElement>;

  @ViewChild('ohlc', { static: true }) ohlcRef!: ElementRef<SVGGElement>;

  @ViewChild('ohlc_yAxisL_grp', { static: true }) ohlc_yAxisL_grp!: ElementRef<SVGGElement>;
  @ViewChild('ohlcAxisLeft', { static: true }) ohlcAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('ohlcAxisRectLeft', { static: true }) ohlcAxisRectLeft!: ElementRef<SVGRectElement>;

  @ViewChild('ohlc_yAxisR_grp', { static: true }) ohlc_yAxisR_grp!: ElementRef<SVGGElement>;
  @ViewChild('ohlcAxisRight', { static: true }) ohlcAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('ohlcAxisRectRight', { static: true }) ohlcAxisRectRight!: ElementRef<SVGRectElement>;
  // #endregion ohlc

  // #region VOLUME GROUP
  @ViewChild('volumeSection', { static: true }) volumeSection!: ElementRef<SVGGElement>;
  @ViewChild('volumeSectionRect', { static: true }) volumeSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('volumeContent', { static: true }) volumeContent!: ElementRef<SVGGElement>;
  @ViewChild('volumeContentRect', { static: true }) volumeContentRect!: ElementRef<SVGRectElement>;
  @ViewChild('volumeChart', { static: true }) volumeChartRef!: ElementRef<SVGGElement>;

  @ViewChild('volume_yAxisL', { static: true }) volume_yAxisL!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisL_grp', { static: true }) volume_yAxisL_grp!: ElementRef<SVGGElement>;
  @ViewChild('volumeAxisRectLeft', { static: true }) volumeAxisRectLeft!: ElementRef<SVGRectElement>;

  @ViewChild('volume_yAxisR', { static: true }) volume_yAxisR!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisR_grp', { static: true }) volume_yAxisR_grp!: ElementRef<SVGGElement>;
  @ViewChild('volumeAxisRectRight', { static: true }) volumeAxisRectRight!: ElementRef<SVGRectElement>;
  // #endregion VOLUME GROUP

  @ViewChild('macdSection', { static: true }) macdSection!: ElementRef<SVGGElement>;
  @ViewChild('macdContent', { static: true }) rsiSectionontentBRef!: ElementRef<SVGGElement>;
  @ViewChild('macdContentRect', { static: true }) rsiSectionontentBRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('macdSectionRect', { static: true }) sectionRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('rsiSection', { static: true }) rsiSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rsiSectionContent', { static: true }) rsiSectionContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rsiSectionContentRect', { static: true }) rsiSectionContentRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('rsiSectionRect', { static: true }) sectionRectCRef!: ElementRef<SVGRectElement>;

  // #region Axes

  @ViewChild('xAxisTopGroup', { static: true }) xAxisTopGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRect', { static: true }) xAxisTopRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsTop', { static: true }) xAxisMonthsTopRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: true }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('xAxisBottomGroup', { static: true }) xAxisBottomGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: true }) xAxisBottomRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: true }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: true }) xAxisBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('macdAxisGroupLeft', { static: true }) yAxisLeftGroupBRef!: ElementRef<SVGGElement>;
  @ViewChild('macdAxisLeft', { static: true }) yAxisLeftBRef!: ElementRef<SVGGElement>;
  @ViewChild('macdAxisRectLeft', { static: true }) yAxisLeftRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('macdAxisGroupRight', { static: true }) yAxisRightGroupBRef!: ElementRef<SVGGElement>;
  @ViewChild('macdAxisRight', { static: true }) yAxisRightBRef!: ElementRef<SVGGElement>;
  @ViewChild('macdAxisRectRight', { static: true }) yAxisRightRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisLeftGroupC', { static: true }) yAxisLeftGroupCRef!: ElementRef<SVGGElement>;
  @ViewChild('rsiAxisLeft', { static: true }) rsiAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftRectC', { static: true }) yAxisLeftRectCRef!: ElementRef<SVGRectElement>;

  @ViewChild('rsiAxisGroupRight', { static: true }) rsiAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rsiAxisRight', { static: true }) rsiAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightRectC', { static: true }) yAxisRightRectCRef!: ElementRef<SVGRectElement>;

  // #endregion Axes

  // #region @VIEWCHILD lIST
  @ViewChild('sma1', { static: true }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: true }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: true }) sma3Ref!: ElementRef<SVGGElement>;

  // MACD GROUP
  @ViewChild('macdChart', { static: true }) macdChartRef!: ElementRef<SVGGElement>;

  // RSIGROUP
  @ViewChild('rsiGroup', { static: true }) rsiGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopOverLoadingComponent;
  // #endregion

  gCandlestick: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    private data: ChartDataService,
    private layout: LayoutService,
    private axes: PartsAxesService,
    private scales:ScalesService,
    private popOverService: JzPopOversService,
    private ohlcChart: ChartOhlcService,
    private volumeChart: VolumeChartService,
    private smaChart: SmaChartService,
    private macdChart: ChartMacdService,
    private rsiIndicator: ChartRsiIndic
  ) {
    document.documentElement.style.setProperty('--plt-chart-1', 'black');
    document.documentElement.style.setProperty('--plt-chart-2', '#212922');
    document.documentElement.style.setProperty('--plt-chart-3', '#6F9E7C');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }

  ngOnInit(): void {  }

  ngAfterViewInit() {
    this.popover_loading.show();
    const ticker = 'NVDA';

    this.stockPriceService.getStockPrices(ticker).subscribe(
      (data: StockPriceHistory[]) => {
        this.popover_loading.hide();
        this.data.stockPriceHistoryData = data;
        this.createChart();
      },
      (error) => {
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
        console.error("Error fetching stock prices:", error);
      }
    );
  }

  createChart(): void {  
    this.createChartFramework();
    this.layout.createScaffolding();
    this.data.scrubData();
    this.scales.createScales();
    this.scales.createMacdYScale(this.data.macdData, this.layout.macdSectionRect.height.baseVal.value);
    this.scales.createRsiYScale(this.layout.rsiSectionRect.height.baseVal.value);
    this.scales.rsiYscale
    this.axes.drawAxes();
    this.constructChart();
  }

  createChartFramework() {
    this.layout.svgContainer = this.svgContainerRef.nativeElement;
    this.layout.svgElement = this.svgElementRef;
    this.layout.svgElementRect = this.svgElementRectRef.nativeElement;

    this.layout.sectionsContainer = this.sectionsRef.nativeElement;
    this.layout.sectionsContainerRect = this.sectionsRectRef.nativeElement;

    // #region OHLC
    this.ohlcChart.ohlcAxisLeft = this.ohlcAxisLeft;
    this.ohlcChart.ohlc_yAxisL_grp = this.ohlc_yAxisL_grp.nativeElement;
    this.ohlcChart.ohlcAxisRectLeft = this.ohlcAxisRectLeft.nativeElement;

    //this.layout.ohlcAxisRight = this.ohlcAxisRight.nativeElement;
    //this.layout.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    //this.layout.ohlcAxisRectRight = this.ohlcAxisRectRight.nativeElement;

    this.ohlcChart.ohlcAxisRight = this.ohlcAxisRight;
    this.ohlcChart.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    this.ohlcChart.ohlcAxisRectRight = this.ohlcAxisRectRight.nativeElement;

    this.layout.ohlcSection = this.ohlcSection.nativeElement;
    this.layout.ohlcSectionRect = this.ohlcSectionRect.nativeElement;
    this.layout.ohlcSectionContent = this.ohlcSectionContent.nativeElement;
    this.layout.ohlcSectionContentRect = this.ohlcSectionContentRect.nativeElement;
    // #endregion OHLC
    // #region VOLUME
    this.layout.volumeSection = this.volumeSection.nativeElement;
    this.layout.volumeSectionRect = this.volumeSectionRect.nativeElement;
    this.layout.volumeContent = this.volumeContent.nativeElement;
    this.layout.volumeContentRect = this.volumeContentRect.nativeElement;
    this.layout.volume_yAxisL = this.volume_yAxisL.nativeElement;
    this.layout.volume_yAxisL_grp = this.volume_yAxisL_grp.nativeElement;
    this.layout.volumeAxisRectLeft = this.volumeAxisRectLeft.nativeElement;
    this.layout.volume_yAxisR = this.volume_yAxisR.nativeElement;
    this.layout.volume_yAxisR_grp = this.volume_yAxisR_grp.nativeElement;
    this.layout.volumeAxisRectRight = this.volumeAxisRectRight.nativeElement;
    // #endregion VOLUME

    // #region MACD
    this.layout.macdSection = this.macdSection.nativeElement;
    this.layout.macdSectionRect = this.sectionRectBRef.nativeElement;
    this.layout.macdContent = this.rsiSectionontentBRef.nativeElement;
    this.layout.macdContentRect = this.rsiSectionontentBRectRef.nativeElement;
    this.layout.macdChart = this.macdChartRef.nativeElement;
    // #rendegion MACD

    this.layout.rsiSection = this.rsiSectionRef.nativeElement;
    this.layout.rsiSectionRect = this.sectionRectCRef.nativeElement;
    this.layout.rsiSectionContent = this.rsiSectionContentRef.nativeElement;
    this.layout.rsiSectionContentRect = this.rsiSectionContentRectRef.nativeElement;

    this.layout.rsiGroup = this.rsiGroupRef.nativeElement;
   
    this.layout.sma1 = this.sma1Ref.nativeElement;
    this.layout.sma2 = this.sma2Ref.nativeElement;
    this.layout.sma3 = this.sma3Ref.nativeElement;

    this.layout.xAxisTopGroup = this.xAxisTopGroupRef.nativeElement;
    this.layout.xAxisTopRect = this.xAxisTopRectRef.nativeElement;
    this.layout.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

    this.layout.xAxisBottomGroup = this.xAxisBottomGroupRef.nativeElement;
    this.layout.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
    this.layout.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;

    this.layout.macdAxisLeft = this.yAxisLeftBRef.nativeElement;
    this.layout.macdAxisGroupLeft = this.yAxisLeftGroupBRef.nativeElement;;
    this.layout.macdAxisRectLeft = this.yAxisLeftRectBRef.nativeElement;

    this.layout.macdAxisRight = this.yAxisRightBRef.nativeElement;
    this.layout.macdAxisGroupRight = this.yAxisRightGroupBRef.nativeElement;
    this.layout.macdAxisRectRight = this.yAxisRightRectBRef.nativeElement;

    this.layout.rsiAxisLeft = this.rsiAxisLeftRef.nativeElement;
    this.layout.yAxisLeftGroupC = this.yAxisLeftGroupCRef.nativeElement;;
    this.layout.yAxisLeftRectC = this.yAxisLeftRectCRef.nativeElement;

    this.layout.rsiAxisRight = this.rsiAxisRightRef.nativeElement;
    this.layout.rsiAxisGroupRight = this.rsiAxisGroupRightRef.nativeElement;
    this.layout.yAxisRightRectC = this.yAxisRightRectCRef.nativeElement;


   this.layout.volumeSectionRect = this.volumeSectionRect.nativeElement;

    this.layout.macdSectionRect = this.sectionRectBRef.nativeElement;
    this.layout.rsiSectionRect = this.sectionRectCRef.nativeElement;

    //this.axes.xAxisMonthsTop = this.xAxisMonthsTopRef;
    //this.axes.xAxisMonthsBottom = this.xAxisMonthsBottomRef;
    //this.axes.xAxisBottom = this.xAxisBottomRef;

    this.layout.ohlcAxisLeft = this.ohlcAxisLeft.nativeElement;
    this.layout.ohlc_yAxisL_grp = this.ohlc_yAxisL_grp.nativeElement;
    this.layout.ohlcAxisRectLeft = this.ohlcAxisRectLeft.nativeElement;

    this.layout.ohlcAxisRight = this.ohlcAxisRight.nativeElement;
    this.layout.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    this.layout.ohlcAxisRectRight = this.ohlcAxisRectRight.nativeElement;

  //  this.ohlcChart.yAxisRightA = this.yAxisRightARef;

    this.axes.macdAxisLeft = this.yAxisLeftBRef;
    this.axes.macdAxisRight = this.yAxisRightBRef;

    this.axes.rsiAxisLeft = this.rsiAxisLeftRef;
    this.axes.rsiAxisRight = this.rsiAxisRightRef;

  /*  this.volumeChart.*/
  }

  constructChart(): void {
    this.drawCandlestick();
    this.drawVolume();
    this.drawSma1(5);
    this.drawSma2(50);
    this.drawSma3(100);
    this.drawMacd();
   this.drawRsi();
  }

  drawCandlestick(): void {
    this.ohlcChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.ohlcYscale)
      .setTargetGroup(this.ohlcRef.nativeElement)
      .setCandleWidth()
      .drawAxes()
      .draw();
  }

  drawVolume(): void {
    this.volumeChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.volumeYscale)
      .setTargetGroup(this.volumeContent.nativeElement)
      .setBarWidth()
      .drawAxes()
      .draw();
  }

  drawSma1(period:number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.ohlcYscale)
      .setTargetGroup(this.layout.sma1) // Specify target group
      .setRollingPeriod(period)
      .setColor('#4E59D0')
      .draw();
  }

  drawSma2(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.ohlcYscale)
      .setTargetGroup(this.layout.sma2) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#F1FEC6')
      .draw();
  }

  drawSma3(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.ohlcYscale)
      .setTargetGroup(this.layout.sma3) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#ff3a20')
      .draw();
  }

  drawMacd():void {
    this.macdChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.macdYscale)
      .setTargetGroup(this.layout.macdChart)
      .setPeriods(12, 26, 9) // Typical MACD periods
      .drawAxes()
      .draw();
  }

  drawRsi(): void {
    this.rsiIndicator
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.rsiYscale)
      .setTargetGroup(this.layout.rsiGroup) // Define a <g> for RSI
      .setRollingPeriod(14) // Optional: Change the period
      .drawAxes()
      .draw();

  }

}
