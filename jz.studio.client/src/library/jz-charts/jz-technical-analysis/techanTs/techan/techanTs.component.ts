
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
  @ViewChild('sectionsRect', { static: true }) sectionsRectRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: true }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  // #region ohlc
  @ViewChild('ohlcSection', { static: true }) ohlcSection!: ElementRef<SVGGElement>;
  @ViewChild('ohlcSectionRect', { static: true }) ohlcSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('ohlcSectionContent', { static: true }) ohlcSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('ohlcSectionContentRect', { static: true }) ohlcSectionContentRect!: ElementRef<SVGRectElement>;

 // @ViewChild('ohlcSectionContent', { static: true }) ohlcSectionContent!: ElementRef<SVGGElement>;
/*  @ViewChild('ohlcRect', { static: true }) ohlcRectRef!: ElementRef<SVGRectElement>;*/
  @ViewChild('ohlc', { static: true }) ohlcRef!: ElementRef<SVGGElement>;

  @ViewChild('ohlc_yAxisL_grp', { static: true }) ohlc_yAxisL_grp!: ElementRef<SVGGElement>;
  @ViewChild('ohlc_yAxisL', { static: true }) ohlc_yAxisL!: ElementRef<SVGGElement>;
  @ViewChild('ohlc_yAxisL_rct', { static: true }) ohlc_yAxisL_rct!: ElementRef<SVGRectElement>;

  @ViewChild('ohlc_yAxisR_grp', { static: true }) ohlc_yAxisR_grp!: ElementRef<SVGGElement>;
  @ViewChild('ohlc_yAxisR', { static: true }) ohlc_yAxisR!: ElementRef<SVGGElement>;
  @ViewChild('ohlc_yAxisR_rct', { static: true }) ohlc_yAxisR_rct!: ElementRef<SVGRectElement>;
  // #endregion ohlc

  // #region VOLUME GROUP
  @ViewChild('volumeSection', { static: true }) volumeSection!: ElementRef<SVGGElement>;
  @ViewChild('volumeSectionRect', { static: true }) volumeSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('volumeContent', { static: true }) volumeContent!: ElementRef<SVGGElement>;
  @ViewChild('volumeContentRect', { static: true }) volumeContentRect!: ElementRef<SVGRectElement>;
  @ViewChild('volumeChart', { static: true }) volumeChartRef!: ElementRef<SVGGElement>;

  @ViewChild('volume_yAxisL_grp', { static: true }) volume_yAxisL_grp!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisL', { static: true }) volume_yAxisL!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisL_rct', { static: true }) volume_yAxisL_rct!: ElementRef<SVGRectElement>;

  @ViewChild('volume_yAxisR_grp', { static: true }) volume_yAxisR_grp!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisR', { static: true }) volume_yAxisR!: ElementRef<SVGGElement>;
  @ViewChild('volume_yAxisR_rct', { static: true }) volume_yAxisR_rct!: ElementRef<SVGRectElement>;
  // #endregion VOLUME GROUP

  @ViewChild('macdSection', { static: true }) macdSection!: ElementRef<SVGGElement>;
  @ViewChild('sectionContentB', { static: true }) sectionContentBRef!: ElementRef<SVGGElement>;
  @ViewChild('sectionContentBRect', { static: true }) sectionContentBRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('sectionRectB', { static: true }) sectionRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('sectionC', { static: true }) sectionCRef!: ElementRef<SVGGElement>;
  @ViewChild('sectionContentC', { static: true }) sectionContentCRef!: ElementRef<SVGGElement>;
  @ViewChild('sectionContentCRect', { static: true }) sectionContentCRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('sectionRectC', { static: true }) sectionRectCRef!: ElementRef<SVGRectElement>;

  // #region Axes

  @ViewChild('xAxisTopGroup', { static: true }) xAxisTopGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRect', { static: true }) xAxisTopRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsTop', { static: true }) xAxisMonthsTopRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: true }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('xAxisBottomGroup', { static: true }) xAxisBottomGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: true }) xAxisBottomRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: true }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: true }) xAxisBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('yAxisLeftGroupB', { static: true }) yAxisLeftGroupBRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftB', { static: true }) yAxisLeftBRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftRectB', { static: true }) yAxisLeftRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisRightGroupB', { static: true }) yAxisRightGroupBRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightB', { static: true }) yAxisRightBRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightRectB', { static: true }) yAxisRightRectBRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisLeftGroupC', { static: true }) yAxisLeftGroupCRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftC', { static: true }) yAxisLeftCRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftRectC', { static: true }) yAxisLeftRectCRef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisRightGroupC', { static: true }) yAxisRightGroupCRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightC', { static: true }) yAxisRightCRef!: ElementRef<SVGGElement>;
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
    document.documentElement.style.setProperty('--plt-chart-2', '#0A0A0A');
    document.documentElement.style.setProperty('--plt-chart-3', '#9ed8e5');
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
    this.scales.createMacdYScale(this.data.macdData, this.layout.sectionRectB.height.baseVal.value);
    this.scales.createRsiYScale(this.layout.sectionRectC.height.baseVal.value);
    this.scales.rsiYscale
    this.axes.drawAxes();
    this.constructChart();
  }

  createChartFramework() {
    this.layout.svgContainer = this.svgContainerRef.nativeElement;
    this.layout.svgElement = this.svgElementRef;
    this.layout.svgElementRect = this.svgElementRectRef.nativeElement;

    this.layout.sections = this.sectionsRef.nativeElement;
    this.layout.sectionsRect = this.sectionsRectRef.nativeElement;

    // #region OHLC
    this.ohlcChart.ohlc_yAxisL = this.ohlc_yAxisL;
    this.ohlcChart.ohlc_yAxisL_grp = this.ohlc_yAxisL_grp.nativeElement;
    this.ohlcChart.ohlc_yAxisL_rct = this.ohlc_yAxisL_rct.nativeElement;

    //this.layout.ohlc_yAxisR = this.ohlc_yAxisR.nativeElement;
    //this.layout.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    //this.layout.ohlc_yAxisR_rct = this.ohlc_yAxisR_rct.nativeElement;

    this.ohlcChart.ohlc_yAxisR = this.ohlc_yAxisR;
    this.ohlcChart.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    this.ohlcChart.ohlc_yAxisR_rct = this.ohlc_yAxisR_rct.nativeElement;

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
    // #endregion VOLUME

    // #region MACD
    this.layout.macdSection = this.macdSection.nativeElement;
    this.layout.sectionRectB = this.sectionRectBRef.nativeElement;
    this.layout.sectionContentB = this.sectionContentBRef.nativeElement;
    this.layout.sectionContentBRect = this.sectionContentBRectRef.nativeElement;
    this.layout.macdChart = this.macdChartRef.nativeElement;
    // #rendegion MACD

    this.layout.sectionC = this.sectionCRef.nativeElement;
    this.layout.sectionRectC = this.sectionRectCRef.nativeElement;
    this.layout.sectionContentC = this.sectionContentCRef.nativeElement;
    this.layout.sectionContentCRect = this.sectionContentCRectRef.nativeElement;

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

    this.layout.yAxisLeftB = this.yAxisLeftBRef.nativeElement;
    this.layout.yAxisLeftGroupB = this.yAxisLeftGroupBRef.nativeElement;;
    this.layout.yAxisLeftRectB = this.yAxisLeftRectBRef.nativeElement;

    this.layout.yAxisRightB = this.yAxisRightBRef.nativeElement;
    this.layout.yAxisRightGroupB = this.yAxisRightGroupBRef.nativeElement;
    this.layout.yAxisRightRectB = this.yAxisRightRectBRef.nativeElement;

    this.layout.yAxisLeftC = this.yAxisLeftCRef.nativeElement;
    this.layout.yAxisLeftGroupC = this.yAxisLeftGroupCRef.nativeElement;;
    this.layout.yAxisLeftRectC = this.yAxisLeftRectCRef.nativeElement;

    this.layout.yAxisRightC = this.yAxisRightCRef.nativeElement;
    this.layout.yAxisRightGroupC = this.yAxisRightGroupCRef.nativeElement;
    this.layout.yAxisRightRectC = this.yAxisRightRectCRef.nativeElement;


   this.layout.volumeSectionRect = this.volumeSectionRect.nativeElement;

    this.layout.sectionRectB = this.sectionRectBRef.nativeElement;
    this.layout.sectionRectC = this.sectionRectCRef.nativeElement;

    this.axes.xAxisMonthsTop = this.xAxisMonthsTopRef;
    this.axes.xAxisMonthsBottom = this.xAxisMonthsBottomRef;
    this.axes.xAxisBottom = this.xAxisBottomRef;

    this.layout.ohlc_yAxisL = this.ohlc_yAxisL.nativeElement;
    this.layout.ohlc_yAxisL_grp = this.ohlc_yAxisL_grp.nativeElement;
    this.layout.ohlc_yAxisL_rct = this.ohlc_yAxisL_rct.nativeElement;

    this.layout.ohlc_yAxisR = this.ohlc_yAxisR.nativeElement;
    this.layout.ohlc_yAxisR_grp = this.ohlc_yAxisR_grp.nativeElement;
    this.layout.ohlc_yAxisR_rct = this.ohlc_yAxisR_rct.nativeElement;

  //  this.ohlcChart.yAxisRightA = this.yAxisRightARef;

    this.axes.yAxisLeftB = this.yAxisLeftBRef;
    this.axes.yAxisRightB = this.yAxisRightBRef;

    this.axes.yAxisLeftC = this.yAxisLeftCRef;
    this.axes.yAxisRightC = this.yAxisRightCRef;



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
      .draw();
  }

  drawRsi(): void {
    this.rsiIndicator
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.rsiYscale)
      .setTargetGroup(this.layout.rsiGroup) // Define a <g> for RSI
      .setRollingPeriod(14) // Optional: Change the period
      .draw();

  }

}
