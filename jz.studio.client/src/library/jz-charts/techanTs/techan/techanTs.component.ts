
/* techanTs.component.ts */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators'; // ✅ add this
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { ohlcData, SvgAttributes } from '../interfaces/techan-interfaces';
import { ChartDataService } from '../services/chart-data.service';
import { ChartType } from '../enums/chart-type'; // adjust the path as needed
import { LayoutService } from '../services/layout.service';
import { select, selection, selectAll, Selection } from 'd3-selection';
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
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { ChartScaffold } from '../interfaces/chart-scaffold';
import { SectionAttributes } from '../interfaces/section-attributes';
import { chartConfig } from '../interfaces/chart-config';

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechanTsComponent  implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  ChartType = ChartType; // expose enum to template

  // #region @ViewChild List
  @ViewChild('divSvgContainer', { static: false }) divSvgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGElement>;
  @ViewChild('rSvgElement', { static: false }) rSvgElement!: ElementRef<SVGRectElement>;

  @ViewChild('gChartTitle', { static: false }) gChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('rChartTitle', { static: false }) rChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('tChartTitleText', { static: false }) tChartTitleText!: ElementRef<SVGTextElement>;


  @ViewChild('gXaxisTop', { static: false }) gXaxisTop!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRect', { static: false }) xAxisTopRect!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsTop', { static: false }) xAxisMonthsTop!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: false }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('gXaxisBottom', { static: false }) gXaxisBottom!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: false }) xAxisBottomRect!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: false }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: false }) xAxisBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroupBottom', { static: false }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('gSectionsContainer', { static: false }) gSectionsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rSectionsContainer', { static: false }) rSectionsContainer!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: false }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;


  // #region ohlc
  @ViewChild('ohlcChart', { static: false }) ohlcChart!: OhlcChartComponent;

  @ViewChild('gOhlcSection', { static: false }) gOhlcSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rOhlcSection', { static: false }) rOhlcSectionRef!: ElementRef<SVGRectElement>

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
    // #endregion @ViewChild List

  width = 0;

  dataReady = false;
  viewReady = false;
  hydrated = false; // Optional safety to prevent double-draw
  ticker = 'NVDA';
  dateScaleX: any;

  chartScaffold!: ChartScaffold;

  chartXaxisMonthsTop: any;
  chartXaxisMonthsBottom: any;

  svgContainer!: HTMLDivElement;
  xAxisMonthsBottom!: Selection<SVGGElement, unknown, null, undefined>;
  xAxisDays!: any;
  xAxisBottom: any;

  @ViewChild('macdChart', { static: false }) macdChart!: MacdChartComp;

  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    public data: ChartDataService,
    public  layoutService: LayoutService,
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
    console.log('');
    console.log('%c⛏️ XTOR TechanTs', 'color: #90BEE9');
    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    const ticker = 'NVDA';
    this.updateSvgSize();
    window.addEventListener('resize', this.updateSvgSize.bind(this));
    this.fetchData();
    console.log('%c  🔵 ngAfterViewInit TechanTsComponent', 'color:#90BEE9');
    this.viewReady = true;
  }

  private updateSvgSize(): void {
    this.svgContainer = this.divSvgContainer.nativeElement;
   select(this.svgElement.nativeElement)
      .attr('width', this.svgContainer.clientWidth)
      .attr('height', this.svgContainer.clientHeight);

    console.log('%cupdate SvgSize','color:#90BEE9', this.svgElement);
  }

  fetchData(): void {
    this.popover_loading.show();
    this.stockPriceService.getStockPrices(this.ticker).subscribe((data) => {
      this.data.stockPriceHistoryData = data;
      this.dataReady = true;
      console.log('%c     ✔ Data Fetched', 'color:#90BEE9');
      this.popover_loading.hide();
      this.tryCreateChart();
    },
      (error) => {
        this.showError(error);
      }
    );
  }

  tryCreateChart(): void {
    if (this.viewReady && this.dataReady && !this.hydrated) {
      this.hydrated = true;
   //   this.createChartFramework();             // Build framework refs immediatelyfetch
      this.changeDetector.detectChanges(); // Push any binding updates
      this.initializeChartWhenReady();     // ✅ Start safe chart initialization
    }
  }

  initializeChartWhenReady(attempt = 0): void {
   
    if (!this.viewReady || !this.dataReady) {
      console.log('%cNOT READY', 'color:red');
      return;
    } else {
      console.log('%cREADY', 'color:green');
    };

    console.log('%c     ✔ initialize ChartWhenReady', 'color:#90BEE9');
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {

      // ✅ All good — proceed
      this.data.scrubData();
      this.createChartScaffold();
      this.sizeChartElements();
      this.alignChartElements();
      this.createSections();
      this.appendSections();
      this.createScales();
      this.drawAxes();
    });
  }

  private createChartScaffold() {
 
    this.chartScaffold = {
      title: 36, // Title height
      width: this.svgContainer.clientWidth, height: 400,
      xAxisTop: 30, xAxisBottom: 30,
      yAxisLeft: 30, yAxisRight: 30,
      sectionsContainer: undefined,
      sections: undefined
    };

    this.chartScaffold.width = this.svgContainer.clientWidth;
    this.chartScaffold.height = this.svgContainer.clientHeight;

    console.log('%c     ✔ create ChartScaffold', 'color:#90BEE9', this.chartScaffold.width,'x',this.chartScaffold.height);
  }

  private sizeChartElements() {
    console.log('%c     ✔ size ChartElements', 'color:#90BEE9');
    
    select(this.rSvgElement.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.height);

    select(this.rChartTitle.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.title);
    // X-AXIS TOP 
    select(this.xAxisTopRect.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisTop);
    select(this.xAxisBottomRect.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisTop);

    select(this.rSectionsContainer.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.height - this.chartScaffold.title - this.chartScaffold.xAxisTop - this.chartScaffold.xAxisBottom);
  }

  private alignChartElements() {
    select(this.tChartTitleText.nativeElement).attr('y', `${this.chartScaffold.title / 2}`).attr('x', `${this.chartScaffold.width/2}`);
    select(this.gXaxisTop.nativeElement).attr('transform', `translate(0, ${this.chartScaffold.title})`);
    select(this.xAxisMonthsTop.nativeElement).attr('transform', `translate(${this.chartScaffold.yAxisLeft},28)`);
    select(this.gXaxisBottom.nativeElement).attr('transform', `translate(${this.chartScaffold.yAxisLeft}, ${this.chartScaffold.height - this.chartScaffold.xAxisTop})`);
    select(this.gSectionsContainer.nativeElement).attr('transform', `translate(0, ${this.chartScaffold.title + this.chartScaffold.xAxisTop})`);
  }

  private createSections(): void {
   
    let yOffset = 0;

    const sections: { [key in ChartType]?: SectionAttributes } = {};

    for (const entry of chartConfig) {
      if (!entry.include) continue;

      sections[entry.type] = {
        width: this.svgContainer.clientWidth,
        height: entry.height,
        margins: entry.margins,
        x: 0,
        y: yOffset,
        content: null, // Filled in later if neededraw
        spacer: 0,
        pct: 1
      };
      yOffset += entry.height;
    }

    this.chartScaffold.sections = sections;
    console.log('%c sections', 'color:purple', this.chartScaffold.sections);
  }

  private appendSections() {
    select(this.gSectionsContainer.nativeElement)
      .append('g').attr('id','gSection')
      .append('rect').attr('id', 'rSection');
  }

  private createScales(): void {
    console.log('%c     ✔ create Scales', 'color:#90BEE9', this.chartScaffold.sections);
    const section = this.chartScaffold.sections![ChartType.OHLC];
    const width = section!.width - section!.margins.left - section!.margins.right;

    if (this.data.dateExtent[0] && this.data.dateExtent[1]) {
      this.dateScaleX = scaleBand()
        .domain(this.data.parsedData.map(d => d.date.toISOString()))
        .range([0, width])
        .padding(0.1);
    } else {
      this.dateScaleX = scaleBand()
        .domain([])
        .range([0, width]);
    }
    //   console.log('scale:', this.dateScaleX);
    console.log('bandwidth fn?', typeof this.dateScaleX.bandwidth);
    console.log('bandwidth val:', this.dateScaleX.bandwidth?.());
  }

  private createChartFramework() {
    console.log('%c     ✔ createChartFramework', 'color:#90BEE9');
    this.layoutService.divSvgContainer = select(this.divSvgContainer.nativeElement);

    //this.layoutService.gSectionsContainer = select(this.gSectionsContainerRef.nativeElement);
    //this.layoutService.rSectionsContainer = select(this.rSectionsContainerRef.nativeElement);

  //  this.layoutService.rSectionsContainer = this.rs.nativeElement;

  //  this.layoutService.rOhlcSection = select(this.rOhlcSectionRef.nativeElement);
   
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

  //  this.layoutService.gXaxisTop = this.gXaxisTopRef.nativeElement;
  //   this.layoutService.xAxisMonthsTop = this.xAxisMonthsTopRef.nativeElement;

  //  this.layoutService.gXaxisBottom = this.gXaxisBottomRef.nativeElement;
  ////  this.layoutService.xAxisBottomRect = this.xAxisBottomRectRef.nativeElement;
  //  this.layoutService.xAxisMonthsBottom = this.xAxisMonthsBottomRef.nativeElement;
  }

  sizeElements(): void {
    console.log('SIZE', this.rOhlcSectionRef);
  }

  drawAxes(): void {
    console.log('%c     ✔  drawAxes', 'color:#90BEE9');
   // this.xAxisMonthsTop = select(this.xAxisMonthsTop.nativeElement);
    this.xAxisMonthsBottom = select(this.xAxisMonthsBottomRef.nativeElement);
    this.xAxisDays = select(this.xAxisDays);
    this.xAxisBottom = select(this.xAxisBottom);

    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'
    const dateFormatterMajor = timeFormat("%b %Y"); // Example: Jan 2023
    const dateFormatterMinor = timeFormat("%d");    // Example: 1, 2, 3...

    // CHART
    let lastMonth = -1;
    let lastYear = -1;

    type CustomAxisDomain = string | number | Date | { valueOf(): number };

    this.chartXaxisMonthsTop = axisTop(this.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain, index: number) => {
        let date: Date;
        if (typeof domainValue === "string") {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === "number") {
          date = new Date(domainValue);
        } else {
          return "";
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonth || currentYear !== lastYear) {
          lastMonth = currentMonth;
          lastYear = currentYear;
          return `${dateFormatterMajor(date)}`; // Example: "Jan 2023"
        } else {
          return ""; // Skip redundant months
        }
      });

    this.chartXaxisMonthsBottom = axisBottom(this.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain, index: number) => {
        let date: Date;
        if (typeof domainValue === "string") {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === "number") {
          date = new Date(domainValue);
        } else {
          return "";
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonth || currentYear !== lastYear) {
          lastMonth = currentMonth;
          lastYear = currentYear;
          return `${dateFormatterMajor(date)}`; // Example: "Jan 2023"
        } else {
          return ""; // Skip redundant months
        }
      });

    // Apply the tick values based on the domain of scaleBand
    const tickValues = this.dateScaleX.domain(); // Get the domain values from scaleBand

    /*DRAW*/
    select(this.xAxisMonthsTop.nativeElement).call(this.chartXaxisMonthsTop);
    this.xAxisMonthsBottom.call(this.chartXaxisMonthsBottom);
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
      .xScale(this.dateScaleX)
      /*.yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layoutService.sma1) // Specify target group
      .setRollingPeriod(period)
      .setColor('#4E59D0')
      .draw();
  }

  drawSma2(period: number): void {
    this.smaService
      .xScale(this.dateScaleX)
      /*   .yScale(this.layout.scaffold)*/
      .setTargetGroup(this.layoutService.sma2) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#F1FEC6')
      .draw();
  }

  drawSma3(period: number): void {
    this.smaService
      .xScale(this.dateScaleX)
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


