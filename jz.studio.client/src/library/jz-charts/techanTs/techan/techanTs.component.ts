/* techanTs.component.ts */

// #region imports
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators'; // ✅ add this
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { Margins, ohlcData, SvgAttributes } from '../interfaces/techan-interfaces';
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
import { MacdChartComponent } from '../components/macd-chart/macd-chart.component';
import { MacdLayoutService } from '../services/charts/macd/macd-layout.service';
import { OhlcChartComponent } from '../components/ohlc-chart/ohlc-chart.component';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { ChartScaffold } from '../interfaces/chart-scaffold';
import { PanelAttributes } from '../interfaces/panel-attributes';
import { chartConfig } from '../interfaces/chart-config';
import { PanelHostService } from '../services/panel-host.service';
import { ChartComponentMap } from '../maps/chart-component-map'; // Ensure this import exists to avoid errors'
import { baseZIndex } from 'devextreme/ui/overlay';
import { ChartScaffoldService } from '../services/chart-scaffold.service';
import { toISOStringSafe } from '../utils/date-utils';
// #endregion imports

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
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('rSvgElement', { static: false }) rSvgElement!: ElementRef<SVGRectElement>;

  @ViewChild('gChartTitle', { static: false }) gChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('rChartTitle', { static: false }) rChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('tChartTitleText', { static: false }) tChartTitleText!: ElementRef<SVGTextElement>;

  @ViewChild('gAxisTop', { static: false }) gAxisTop!: ElementRef<SVGGElement>;
  @ViewChild('rAxisTop', { static: false }) rAxisTop!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisTopRect', { static: false }) xAxisTopRect!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisTopMonths', { static: false }) gAxisTopMonths!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: false }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('gXaxisBottom', { static: false }) gXaxisBottom!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRect', { static: false }) xAxisBottomRect!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisMonthsBottom', { static: false }) xAxisMonthsBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottom', { static: false }) xAxisBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroupBottom', { static: false }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;

  @ViewChild('gPanelsContainer', { static: false }) gPanelsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rPanelsContainer', { static: false }) rPanelsContainer!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: false }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('panel1', { static: false }) panel1!: ElementRef<SVGGElement>;
  @ViewChild('panel2', { static: false }) panel2!: ElementRef<SVGGElement>;
  @ViewChild('panel3', { static: false }) panel3!: ElementRef<SVGGElement>;
  @ViewChild('panel4', { static: false }) panel4!: ElementRef<SVGGElement>;


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

  // #region Properties
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

  scaffold!: ChartScaffold;
  // #endregion Properties

/*  @ViewChild('macdChart', { static: false }) macdChart!: MacdChartComp;*/

  // #region constructor
  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    public chartData: ChartDataService,
    public  layoutService: LayoutService,
    private popOverService: JzPopOversService,
    private ohlcLayout: OhlcChartLayoutService,
    private volumeLayout: VolumeChartLayoutService,
    private rsiLayout: RsiChartLayoutService,
    private smaService: SmaChartService,
/*    private ohlcChart: OhlcChartComponent,*/
    private macdLayout: MacdLayoutService,
    private macdDraw: MacdDrawService,
   /* private baseLayout: BaseChartLayoutService*/
    private panelHost: PanelHostService,
    private scaffoldSvc: ChartScaffoldService
  ) {
    console.log('');
    console.log('%c⛏️ XTOR TechanTs', 'color: #90BEE9');
    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }
  // #endregion constructor

  ngOnInit(): void { }

  ngAfterViewInit() {
    const ticker = 'NVDA';
    this.updateSvgSize();
    window.addEventListener('resize', this.updateSvgSize.bind(this));
    this.fetchData();

    this.viewReady = true;
    this.initializeChartWhenReady();

    console.log('%c  🔵 ngAfterViewInit TechanTsComponent', 'color:#90BEE9');
  }

  private updateSvgSize(): void {
    this.svgContainer = this.divSvgContainer.nativeElement;
    select(this.svgElement.nativeElement)
      .attr('width', this.svgContainer.clientWidth)
      .attr('height', this.svgContainer.clientHeight);

    console.log('%cupdate SvgSize', 'color:#90BEE9', this.svgElement);
  }

  fetchData(): void {
    this.popover_loading.show();
    this.stockPriceService.getStockPrices(this.ticker).subscribe((data) => {
      this.chartData.stockPriceHistoryData = data;
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
      console.log('%c     ❌ NOT READY', 'color:red');
      return;
    } else {
      console.log('%c     ✔ READY', 'color:green');
    };

    console.log('%c     ✔ initialize ChartWhenReady', 'color:#90BEE9');
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {

      // ✅ All good — proceed
      this.chartData.scrubData();
      this.createChartScaffold();
      this.sizeChartElements();
      this.alignMainChartElements();
      this.sizeAndPlacePanels();
      this.createScales();
      this.drawAxes();

      // ✅ after scaffold + panels exist, publish it
      this.scaffoldSvc.scaffold = this.chartScaffold; 
      this.injectChartsFromConfig();
    });
  }

  // Generic chart injector that supports any chart type defined in chartConfig
  injectChartsFromConfig(): void {
    const panelRefs = [this.panel1, this.panel2, this.panel3, this.panel4];

    chartConfig.forEach((configEntry, index) => {
      if (!configEntry.include) return;

      const chartComponent = ChartComponentMap[configEntry.type];
      const panelRef = panelRefs[index];

      if (!chartComponent || !panelRef) return;

      const compRef = this.panelHost.injectChartComponent(
        panelRef.nativeElement,
        configEntry.type,
        chartComponent
      );

      // Provide shared inputs
      compRef.setInput('data', this.chartData.stockPriceHistoryData);
      compRef.setInput('dateScaleX', this.dateScaleX);
      compRef.setInput('scaffold', this.chartScaffold);   // <— important

      // Mark ready + draw
      compRef.instance.markReadyAndDraw({
        dataReady: true,
        inputsInitialized: true,
        layoutReady: true,
        caller: 'injectChartsFromConfig'
      });

      compRef.changeDetectorRef.detectChanges();
    });
  }

  private createChartScaffold() {
 
    this.chartScaffold = {
      title: 36, // Title height
      width: this.svgContainer.clientWidth, height: 400,
      margins: { bottom: 30, left: 30, right: 30, top: 30, },
      xAxisTop: 30, xAxisBottom: 30,
      yAxisLeft: 30, yAxisRight: 30,
      panelsContainer: undefined,
      panels: undefined
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
    select(this.rAxisTop.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisTop);
    select(this.xAxisBottomRect.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisTop);

    select(this.rPanelsContainer.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.height - this.chartScaffold.title - this.chartScaffold.xAxisTop - this.chartScaffold.xAxisBottom);

  
  }

  private alignMainChartElements() {
    select(this.gPanelsContainer.nativeElement).attr('transform', `translate(0, ${this.chartScaffold.title + this.chartScaffold.xAxisTop})`).classed('panels-container',true);
    select(this.tChartTitleText.nativeElement).attr('y', `${this.chartScaffold.title / 2}`).attr('x', `${this.chartScaffold.width/2}`);
    select(this.gAxisTop.nativeElement).attr('transform', `translate(0, ${this.chartScaffold.title})`);
    select(this.gAxisTopMonths.nativeElement).attr('transform', `translate(${this.chartScaffold.yAxisLeft},${this.chartScaffold.xAxisTop})`);
    select(this.gXaxisBottom.nativeElement).attr('transform', `translate(${this.chartScaffold.yAxisLeft}, ${this.chartScaffold.height - this.chartScaffold.xAxisTop})`);

  }

  /** Always render 4 panels; use <g transform="translate(...)"> for placement. */
  /** Always render 4 panels; use <g transform="translate(...)"> for placement. */
  private sizeAndPlacePanels(): void {
    const containerRect = this.rPanelsContainer.nativeElement.getBoundingClientRect();
    const totalHeight = containerRect.height;
    const panelWidth = containerRect.width;

    const panelRefs: Array<ElementRef<SVGGElement> | undefined> = [
      this.panel1, this.panel2, this.panel3, this.panel4
    ];

    const proportions = [0.4, 0.2, 0.2, 0.2];
    const sum = proportions.reduce((a, b) => a + b, 0) || 1;

    const included = chartConfig.filter(c => c.include);

    let y = 0;
    if (!this.chartScaffold.panels) this.chartScaffold.panels = {};

    panelRefs.forEach((ref, i) => {
      if (!ref) return;

      const height = totalHeight * (proportions[i] / sum);

      const g = select(ref.nativeElement).attr('transform', `translate(0, ${y})`);
      g.select('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', panelWidth)
        .attr('height', height);

      const cfg = included[i];
      if (cfg) {
        this.chartScaffold.panels![cfg.type] = {
          ...(this.chartScaffold.panels![cfg.type] ?? {}),
          width: panelWidth,
          height,
          margins: { bottom: 30, left: 30, right: 30, top: 30, },
          x: 0,     // informational
          y,        // informational
          content: null,
          spacer: 0,
          pct: proportions[i] / sum
        };
        g.select('rect').classed('empty-panel', false);
      } else {
        g.select('rect').classed('empty-panel', true);
      }

      y += height;
    });

    console.log('%c✔ sizeAndPlacePanels (translate, no margins)', 'color:#90BEE9', this.chartScaffold.panels);
  }

  private createScales(): void {
    const panel = this.chartScaffold.panels?.[ChartType.OHLC];
    if (!panel) {
      this.dateScaleX = scaleBand().domain([]).range([0, 0]);
      return;
    }
    const width = Math.max(0, panel.width ?? 0);
    const chartWidth = Math.max(0, panel.width - panel.margins.left - panel.margins.right ?? 0);

    const parsed = this.chartData?.parsedData ?? [];
    const domainKeys = parsed.map(d => toISOStringSafe(d.date));
      this.dateScaleX = scaleBand<string>().domain(domainKeys).range([0, chartWidth]).padding(0.1);
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
    select(this.gAxisTopMonths.nativeElement).call(this.chartXaxisMonthsTop);
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


