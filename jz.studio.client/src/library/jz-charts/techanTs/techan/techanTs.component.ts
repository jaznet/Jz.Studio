
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { ohlcData, SectionAttributes } from '../interfaces/techan-interfaces';
import { ChartDataService } from '../services/chart-data.service';
import { LayoutService } from '../services/layout.service';
import { PartsAxesService } from '../services/parts-axes.service';
import { ScalesService } from '../services/scales.service';
import { select, selection, selectAll } from 'd3-selection';
import { SmaChartService } from '../services/charts/chart-sma.service';
import { MacdChartLayoutService } from '../services/charts/macd/macd-chart-layout.service';
import { MacdChartService } from '../services/charts/macd/macd-chart.service';
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

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  
  @ViewChild('gMacdSection', { static: true }) gMacdSection!: ElementRef<SVGGElement>;
  @ViewChild('gMacdContent', { static: true }) gMacdContent!: ElementRef<SVGGElement>;
  @ViewChild('rMacdContentRect', { static: true }) rMacdContentRect!: ElementRef<SVGRectElement>;
  @ViewChild('rMacdSectionRect', { static: true }) rMacdSectionRect!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdAxisGroupLeft', { static: true }) gMacdAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('gMacdAxisLeft', { static: true }) gMacdAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('rMacdAxisLeft', { static: true }) rMacdAxisLeft!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdAxisGroupRight', { static: true }) gMacdAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gMacdAxisRight', { static: true }) gMacdAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rMacdAxisRight', { static: true }) rMacdAxisRight!: ElementRef<SVGRectElement>;

  @ViewChild('gMacdChart', { static: true }) gMacdChart!: ElementRef<SVGRectElement>;
/*  #region*/
  @ViewChild('gRsiSection', { static: true }) gRsiSection!: ElementRef<SVGGElement>;
  @ViewChild('gRsiSectionContent', { static: true }) gRsiSectionContent!: ElementRef<SVGGElement>;
  @ViewChild('rRsiSectionContent', { static: true }) rRsiSectionContent!: ElementRef<SVGRectElement>;
  @ViewChild('rRsiSectionRect', { static: true }) rRsiSectionRect!: ElementRef<SVGRectElement>;
  @ViewChild('gRsiChart', { static: true }) gRsiChart!: ElementRef<SVGGElement>;

  @ViewChild('gRsiAxisGroupLeft', { static: true }) gRsiAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('gRsiAxisLeft', { static: true }) gRsiAxisLeft!: ElementRef<SVGGElement>;

  @ViewChild('rsiAxisGroupRight', { static: true }) rsiAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('gRsiAxisRight', { static: true }) gRsiAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightRectC', { static: true }) yAxisRightRectC!: ElementRef<SVGRectElement>;

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
    private data: ChartDataService,
    private layout: LayoutService,
    private axes: PartsAxesService,
    private scales:ScalesService,
    private popOverService: JzPopOversService,
    private ohlcChart: OhlcChartService,
    private ohlcLayout: OhlcChartLayoutService,
    private volumeChart: VolumeChartService,
    private smaChart: SmaChartService,
    private macdChart: MacdChartService,
    private macdLayout: MacdChartLayoutService,
    private rsiChart: RsiChart,
    private rsiLayout: RsiChartLayoutService,
    private volumeLayout: VolumeChartLayoutService
  ) {
    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
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
    console.log('techan',this.ohlcLayout.axisLeft, this.ohlcLayout.axisRight);

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
    this.macdLayout.initializeSelections({
      gSection: this.gMacdSection,
      rSection: this.rMacdSectionRect,
      gContent: this.gMacdContent,
      rContent: this.rMacdContentRect,
      gChart: this.gMacdChart,

      axisLeft: {
        gAxis: this.gMacdAxisLeft,
        gAxisGroup: this.gMacdAxisGroupLeft,
        rAxis: this.rMacdAxisLeft
      },
      axisRight: {
        gAxis: this.gMacdAxisRight,
        gAxisGroup: this.gMacdAxisGroupRight,
        rAxis: this.rMacdAxisRight
      }
    });
    // #rendegion MACD

    //#region RSI
    this.rsiLayout.initializeSelections({
      gSection: this.gRsiSection,
      rSection: this.rRsiSectionRect,
      gContent: this.gRsiSectionContent,
      rContent: this.rRsiSectionContent,
      gChart: this.gRsiChart, // if used as the chart base

      axisLeft: {
        gAxis: this.gMacdAxisLeft,
        gAxisGroup: this.gMacdAxisGroupLeft,
        rAxis: this.rMacdAxisLeft
      },
      axisRight: {
        gAxis: this.gMacdAxisRight,
        gAxisGroup: this.gMacdAxisGroupRight,
        rAxis: this.rMacdAxisRight
      }
    });
    //#endregion RSI

   this.layout.sma1 = this.sma1Ref.nativeElement;
    this.layout.sma2 = this.sma2Ref.nativeElement;
    this.layout.sma3 = this.sma3Ref.nativeElement;

    this.layout.xAxisTopGroup = this.xAxisTopGroupRef.nativeElement;
    this.layout.xAxisTopRect = this.xAxisTopRectRef.nativeElement;
    this.layout.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

    this.layout.xAxisBottomGroup = this.xAxisBottomGroupRef.nativeElement;
    this.layout.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
    this.layout.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;
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
      .setTargetGroup(this.gOhlcChart.nativeElement)
      .setCandleWidth()
      .drawAxes(this.layout.scaffold)
      .draw();
  }  

  drawVolume(): void {
    this.volumeChart
      .xScale(this.scales.dateScaleX)
  /*    .yScale(this.gVolumeChart.volumeYscale)*/
      .setTargetGroup(this.gVolumeContent.nativeElement)
      .setBarWidth()
      .drawAxes(this.layout.scaffold)
      .draw();
  }

  drawMacd(): void {
    this.macdChart
      .xScale(this.scales.dateScaleX)
      .setTargetGroup(this.macdLayout.gChart)
      .setPeriods(12, 26, 9) // Typical MACD periods
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

  drawRsi(): void {
    this.rsiChart
      .xScale(this.scales.dateScaleX)
      /* .yScale(this.scales.rsiYscale)*/
      .setTargetGroup(this.rsiLayout.gChart) // Define a <g> for RSI
      .setRollingPeriod(14) // Optional: Change the period
      .drawAxes(this.layout.scaffold)
      .draw();
  }
  // #endregion DRAW
}
