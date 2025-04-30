
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
  @ViewChild('gOhlcSectionContent', { static: true }) gOhlcSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcSectionContent', { static: true }) rOhlcSectionContent!: ElementRef<SVGRectElement>;

  @ViewChild('ohlc', { static: true }) ohlcRef!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisGroupLeft', { static: true }) gOhlcAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('gOhlcAxisRectLeft', { static: true }) gOhlcAxisRectLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gOhlcAxisLeft', { static: true }) gOhlcAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('gOhlcAxisRectRight', { static: true }) gOhlcAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gOhlcAxisRight', { static: true }) gOhlcAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('gOhlcAxisRectRight', { static: true }) gOhlcAxisRectRight!: ElementRef<SVGRectElement>;
  // #endregion ohlc

  // #region VOLUME GROUP
  @ViewChild('volumeSection', { static: true }) volumeSection!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeSection', { static: true }) rVolumeSection!: ElementRef<SVGRectElement>;
  @ViewChild('volumeContent', { static: true }) volumeContent!: ElementRef<SVGGElement>;
  @ViewChild('volumeContentRect', { static: true }) volumeContentRect!: ElementRef<SVGRectElement>;
  @ViewChild('volumeChart', { static: true }) volumeChartRef!: ElementRef<SVGGElement>;

  @ViewChild('gVolumeAxisLeft', { static: true }) gVolumeAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisLeft_grp', { static: true }) gVolumeAxisLeft_grp!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisLeft', { static: true }) rVolumeAxisLeft!: ElementRef<SVGRectElement>;

  @ViewChild('gVolumeAxisRight', { static: true }) gVolumeAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('gVolumeAxisRight_grp', { static: true }) gVolumeAxisRight_grp!: ElementRef<SVGGElement>;
  @ViewChild('rVolumeAxisRight', { static: true }) rVolumeAxisRight!: ElementRef<SVGRectElement>;
  // #endregion VOLUME GROUP
  
  @ViewChild('gMacdSection', { static: true }) gMacdSection!: ElementRef<SVGGElement>;
  @ViewChild('gMacdContent', { static: true }) gMacdContent!: ElementRef<SVGGElement>;
  @ViewChild('rMacdContentRect', { static: true }) rMacdContentRect!: ElementRef<SVGRectElement>;
  @ViewChild('rMacdSectionRect', { static: true }) rMacdSectionRect!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdAxisGroupLeft', { static: true }) gMacdAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('gMacdAxisLeft', { static: true }) gMacdAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('rMacdAxisRectLeft', { static: true }) rMacdAxisRectLeft!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdAxisGroupRight', { static: true }) gMacdAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gMacdAxisRight', { static: true }) gMacdAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rMacdAxisRectRight', { static: true }) rMacdAxisRectRight!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdChart', { static: true }) gMacdChart!: ElementRef<SVGRectElement>;
/*  #region*/
  @ViewChild('gRsiSection', { static: true }) gRsiSection!: ElementRef<SVGGElement>;
  @ViewChild('gRsiSectionContent', { static: true }) gRsiSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('rRsiSectionContent', { static: true }) rRsiSectionContent!: ElementRef<SVGRectElement>;
  @ViewChild('rRsiSectionRect', { static: true }) rRsiSectionRect!: ElementRef<SVGRectElement>;

  @ViewChild('gRsiAxisGroupLeft', { static: true }) gRsiAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('gRsiAxisLeft', { static: true }) gRsiAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftRectC', { static: true }) yAxisLeftRectC!: ElementRef<SVGRectElement>;

  @ViewChild('rsiAxisGroupRight', { static: true }) rsiAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gRsiAxisRight', { static: true }) gRsiAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightRectC', { static: true }) yAxisRightRectC!: ElementRef<SVGRectElement>;

  // #endregion Rsi

  // #region @VIEWCHILD lIST
  @ViewChild('sma1', { static: true }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: true }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: true }) sma3Ref!: ElementRef<SVGGElement>;

  // RSIGROUP
  @ViewChild('rsiGroup', { static: true }) rsiGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopOverLoadingComponent;
  // #endregion

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
    private rsi: ChartRsiIndic
  ) {
    document.documentElement.style.setProperty('--plt-chart-1', '111111');
    document.documentElement.style.setProperty('--plt-chart-2', '#212922');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
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
    this.scales.createScales(this.layout.scaffold);
    this.axes.drawAxes();
    this.constructChart();
  }

  createChartFramework() {
    this.layout.divSvgContainer = select(this.divSvgContainer.nativeElement);
    this.layout.svgElement = select( this.svgElement.nativeElement);
    this.layout.rSvgElement =select(this.rSvgElementRef.nativeElement);

    this.layout.sectionsContainer = this.gSectionsContainer.nativeElement;
    this.layout.rSectionsContainer = this.sectionsRectRef.nativeElement;

    // #region OHLC
    this.ohlcChart.gOhlcAxisLeft = select(this.gOhlcAxisLeft.nativeElement);
    this.ohlcChart.gOhlcAxisGroupLeft = select(this.gOhlcAxisGroupLeft.nativeElement);
    this.ohlcChart.gOhlcAxisRectLeft = select( this.gOhlcAxisRectLeft.nativeElement);

    this.ohlcChart.gOhlcAxisRight =select( this.gOhlcAxisRight.nativeElement);
    this.ohlcChart.gOhlcAxisRectRight = select(this.gOhlcAxisRectRight.nativeElement);
    this.ohlcChart.gOhlcAxisRectRight = select(this.gOhlcAxisRectRight.nativeElement);

    this.ohlcChart.gOhlcSection = this.gOhlcSection.nativeElement;
    this.ohlcChart.rOhlcSection = select( this.rOhlcSection.nativeElement);
    this.ohlcChart.gOhlcSectionContent = select(this.gOhlcSectionContent.nativeElement);
    this.ohlcChart.rOhlcSectionContent = select( this.rOhlcSectionContent.nativeElement);
    // #endregion OHLC

    // #region VOLUME
    this.volumeChart.gVolumeSection = select(this.volumeSection.nativeElement);
    this.volumeChart.rVolumeSection = select(this.rVolumeSection.nativeElement);
    this.volumeChart.gVolumeSectionContent = select(this.volumeContent.nativeElement);
    this.volumeChart.rVolumeSectionContent = select(this.volumeContentRect.nativeElement);
    this.volumeChart.gVolumeAxisLeft = select( this.gVolumeAxisLeft.nativeElement);
    this.volumeChart.gVolumeAxisLeft_grp = select(this.gVolumeAxisLeft_grp.nativeElement);
    this.volumeChart.rVolumeAxisLeft = select(this.rVolumeAxisLeft.nativeElement);
    this.volumeChart.gVolumeAxisRight = select(this.gVolumeAxisRight.nativeElement);
    this.volumeChart.gVolumeAxisRight_grp = select(this.gVolumeAxisRight_grp.nativeElement);
    this.volumeChart.rVolumeAxisRight = select(this.rVolumeAxisRight.nativeElement);
    this.volumeChart.rVolumeSection = select(this.rVolumeSection.nativeElement);
    // #endregion VOLUME

    // #region MACD
    this.macdChart.gMacdSection = select(this.gMacdSection.nativeElement);
    this.macdChart.rMacdSectionRect = select(this.rMacdSectionRect.nativeElement);
    this.macdChart.gMacdContent = select(this.gMacdContent.nativeElement);
    this.macdChart.rMacdContentRect = select(this.rMacdContentRect.nativeElement);
    this.macdChart.gMacdChart = select(this.gMacdChart.nativeElement);

    this.macdChart.gMacdAxisLeft = select(this.gMacdAxisLeft.nativeElement);
    this.macdChart.gMacdAxisGroupLeft = select(this.gMacdAxisGroupLeft.nativeElement);
    this.macdChart.rMacdAxisRectLeft = select(this.rMacdAxisRectLeft.nativeElement);

    this.macdChart.gMacdAxisRight = select(this.gMacdAxisRight.nativeElement);
    this.macdChart.gMacdAxisGroupRight = select( this.gMacdAxisGroupRight.nativeElement);
    this.macdChart.rMacdAxisRectRight = select( this.rMacdAxisRectRight.nativeElement);
    // #rendegion MACD

    this.rsi.gRsiSection = select( this.gRsiSection.nativeElement);
    this.rsi.rRsiSectionRect = select(this.rRsiSectionRect.nativeElement);
    this.rsi.gRsiSection = select(this.gRsiSection.nativeElement);
    this.rsi.gRsiSectionContent = select(this.gRsiSectionContent.nativeElement)
    this.rsi.rRsiSectionContent = select( this.rRsiSectionContent.nativeElement);
    this.rsi.rsiGroup = this.rsiGroupRef.nativeElement;

   this.layout.sma1 = this.sma1Ref.nativeElement;
    this.layout.sma2 = this.sma2Ref.nativeElement;
    this.layout.sma3 = this.sma3Ref.nativeElement;

    this.layout.xAxisTopGroup = this.xAxisTopGroupRef.nativeElement;
    this.layout.xAxisTopRect = this.xAxisTopRectRef.nativeElement;
    this.layout.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

    this.layout.xAxisBottomGroup = this.xAxisBottomGroupRef.nativeElement;
    this.layout.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
    this.layout.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;

    this.rsi.gRsiAxisLeft = select(this.gRsiAxisLeft.nativeElement);
    this.rsi.gRsiAxisGroupLeft = select(this.gRsiAxisGroupLeft.nativeElement);
    this.rsi.yAxisLeftRectC = this.yAxisLeftRectC.nativeElement;

    this.rsi.gRsiAxisRight = select(this.gRsiAxisRight.nativeElement);
    this.rsi.rsiAxisGroupRight = this.rsiAxisGroupRight.nativeElement;
    this.rsi.yAxisRightRectC = this.yAxisRightRectC.nativeElement;
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

  // #region DRAW

  drawCandlestick(): void {
    this.ohlcChart
      .xScale(this.scales.dateScaleX)
/*      .yScale(this.ohlcChart.ohlcYscale)*/
      .setTargetGroup(this.ohlcRef.nativeElement)
      .setCandleWidth()
      .drawAxes(this.layout.scaffold)
      .draw();
  }  

  drawVolume(): void {
    this.volumeChart
      .xScale(this.scales.dateScaleX)
  /*    .yScale(this.volumeChart.volumeYscale)*/
      .setTargetGroup(this.volumeContent.nativeElement)
      .setBarWidth()
      .drawAxes(this.layout.scaffold)
      .draw();
  }

  drawSma1(period:number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      /*.yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layout.sma1) // Specify target group
      .setRollingPeriod(period)
      .setColor('#4E59D0')
      .draw();
  }

  drawSma2(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
   /*   .yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layout.sma2) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#F1FEC6')
      .draw();
  }

  drawSma3(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
   /*   .yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layout.sma3) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#ff3a20')
      .draw();
  }

  drawMacd():void {
    this.macdChart
      .xScale(this.scales.dateScaleX)
      .setTargetGroup(this.macdChart.gMacdChart)
      .setPeriods(12, 26, 9) // Typical MACD periods
      .drawAxes(this.layout.scaffold)
      .draw();
  }

  drawRsi(): void {
    this.rsi
      .xScale(this.scales.dateScaleX)
     /* .yScale(this.scales.rsiYscale)*/
      .setTargetGroup(this.rsi.rsiGroup) // Define a <g> for RSI
      .setRollingPeriod(14) // Optional: Change the period
      .drawAxes(this.layout.scaffold)
      .draw();
  }
  // #endregion DRAW
}
