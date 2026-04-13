/* technical-analysis.component.ts */

// #region imports
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { take } from 'rxjs/operators';
import { axisBottom, axisTop } from 'd3-axis';
import { select, Selection } from 'd3-selection';
import { scaleBand, type ScaleBand } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { OverlayContainer } from '@angular/cdk/overlay';

import { HtmlElementOverlayContainer } from '../../overlays/html-element-overlay-container'

import { ChartType } from './enums/chart-type';
import { chartConfig } from './interfaces/chart-config';
import { Scaffold } from './interfaces/scaffold.interface';
import { ChartComponentMap } from './maps/chart-component-map';
import { ChartDataService } from './services/chart-data.service';
import { ChartScaffoldService } from './services/chart-scaffold.service';
import { MacdDrawService } from './services/charts/macd/macd-draw.service';
import { MacdLayoutService } from './services/charts/macd/macd-layout.service';
import { OhlcChartLayoutService } from './services/charts/ohlc/ohlc-chart-layout.service';
import { RsiChartLayoutService } from './services/charts/rsi/rsi-chart-layout.service';
import { VolumeChartLayoutService } from './services/charts/volume/volume-chart-layout.service';
import { PanelHostService } from './services/panel-host.service';
import { PanelLayoutService } from './engine/layout/panel-layout.service';
import { OhlcChartComponent } from './charts/ohlc/ohlc-chart.component';
import { TechnicalAnalysisService } from './technical-analysis.service';
import type { PanelViewModel } from './interfaces/panel-interfaces';
import { ChartLayoutRequest } from './interfaces/chart-layout-request.interface';

// #endregion imports

export function createHtmlElementOverlayContainer(host: ElementRef): OverlayContainer {
  return new HtmlElementOverlayContainer(host.nativeElement);
}

@Component({
  selector: 'techanTs',
  imports: [],
  templateUrl: './technical-analysis.component.html',
  styleUrls: ['./technical-analysis.component.scss'],
  providers: [
    {
      provide: OverlayContainer,
      useFactory: createHtmlElementOverlayContainer,
      deps: [ElementRef],
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class TechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  ChartType = ChartType;

  // #region @ViewChild List
  @ViewChild('divSvgContainer', { static: false }) divSvgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('rSvgElement', { static: false }) rSvgElement!: ElementRef<SVGRectElement>;

  @ViewChild('gChartTitle', { static: false }) gChartTitle!: ElementRef<SVGGElement>;
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

  // #region VOLUME
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
  // #endregion VOLUME

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
  // #endregion RSI

  @ViewChild('sma1', { static: false }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: false }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: false }) sma3Ref!: ElementRef<SVGGElement>;

  @ViewChild('gRsiGroup', { static: false }) gRsiGroupRef!: ElementRef<SVGGElement>;

  // #endregion @ViewChild List

  // #region Properties

  width = 0;

  panelViewModels: PanelViewModel[] = [];

  dataReady = false;
  viewReady = false;
  hydrated = false;
  ticker = 'NVDA';

  dateScaleX!: ScaleBand<Date>;

  scaffold!: Scaffold;

  chartXaxisMonthsTop: any;
  chartXaxisMonthsBottom: any;

  svgContainer!: HTMLDivElement;
  xAxisMonthsBottom!: Selection<SVGGElement, unknown, null, undefined>;
  xAxisDays: any;
  xAxisBottom: any;
  // #endregion Properties

  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechnicalAnalysisService,
    public chartData: ChartDataService,
    public layoutService: PanelLayoutService,
    private ohlcLayout: OhlcChartLayoutService,
    private volumeLayout: VolumeChartLayoutService,
    private rsiLayout: RsiChartLayoutService,
    private macdLayout: MacdLayoutService,
    private macdDraw: MacdDrawService,
    private panelHost: PanelHostService,
    private scaffoldSvc: ChartScaffoldService
  ) {
    console.log('');
    console.log('%c ---------- Technical Analysis Chart ----------', 'color: #D9B208');
    console.log('%c⛏️ XTOR Technical Analysis Component', 'color: #D9B208');

    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');

    this.xAxisDays = null;
    this.xAxisBottom = null;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
  
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
      .attr('width', this.divSvgContainer.nativeElement.clientWidth)
      .attr('height', this.divSvgContainer.nativeElement.clientHeight);

    select(this.rSvgElement.nativeElement)
      .attr('width', this.divSvgContainer.nativeElement.clientWidth)
      .attr('height', this.divSvgContainer.nativeElement.clientHeight);


    console.log('%c     svgElement ', 'color:#8fb996', this.svgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
    console.log('%c     rSvgElement', 'color:#f9dc5c', this.rSvgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
  }

  private renderOuterScaffoldOnce(): void {
    const scaffold = this.scaffold;

    const pc = scaffold?.panelsContainer;
    if (!scaffold || !pc) return;



    select(this.rChartTitle.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr('height', scaffold.titleHeight);

    select(this.gAxisTop.nativeElement)
      .attr('transform', `translate(0, ${scaffold.titleHeight})`);

    select(this.rAxisTop.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr('height', scaffold.xAxisTop);

    select(this.gPanelsContainer.nativeElement)
      .attr('transform', `translate(${pc.x}, ${pc.y})`);

    select(this.rPanelsContainer.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', pc.width)
      .attr('height', pc.height);

    select(this.gXaxisBottom.nativeElement)
      .attr('transform', `translate(0, ${scaffold.height - scaffold.xAxisBottom})`);

    select(this.xAxisBottomRect.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr('height', scaffold.xAxisBottom);
  }



  private fetchData(): void {
    console.log('%c     ✔  fetchData', 'color:#90BEE9');
/*    this.popover_loading.show();*/

    this.stockPriceService.getStockPrices(this.ticker).subscribe(
      (data) => {
        this.chartData.stockPriceHistoryData = data;
        this.dataReady = true;

        console.log('%c     ✔ Data Fetched', 'color:#90BEE9');

   /*     this.popover_loading.hide();*/
        this.tryCreateChart();
      },
      (error) => {
        this.showError(error);
      }
    );
  }

  private tryCreateChart(): void {
    console.log('%c     ✔  tryCreateChart', 'color:#90BEE9');
    if (this.viewReady && this.dataReady && !this.hydrated) {
      this.hydrated = true;
      this.changeDetector.detectChanges();
      this.initializeChartWhenReady();
    }
  }

  private initializeChartWhenReady(attempt = 0): void {
    console.log('%c     ✔  initializeChartWhenReady', 'color:#90BEE9');
    if (!this.viewReady || !this.dataReady) {
      console.log('%c     ❌ NOT READY', 'color:red');
      return;
    } else {
      console.log('%c     ✔ READY', 'color:green');
    }

    console.log('%c     ✔ initialize ChartWhenReady', 'color:#90BEE9');

    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.chartData.scrubData();
      this.createChartScaffold();
      this.sizeAndPlacePanels();
      this.sizeChartElements();
      this.alignMainChartElements();

      this.createScales();
      this.drawAxes();

      this.scaffoldSvc.scaffold = this.scaffold;
      this.injectChartsFromConfig();
    });
  }

  private injectChartsFromConfig(): void {
    console.log('%c     ✔  injectChartsFromConfig', 'color:#90BEE9');
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

      compRef.setInput('data', this.chartData.stockPriceHistoryData);
      compRef.setInput('dateScaleX', this.dateScaleX);
  //    compRef.setInput('scaffold', this.scaffold);

      compRef.instance.markReadyAndDraw({
        dataReady: true,
        inputsInitialized: true,
        caller: 'injectChartsFromConfig'
      });

      compRef.changeDetectorRef.detectChanges();
    });
  }

  private createChartScaffold(): void {
    console.log('%c     ✔  createChartScaffold', 'color:#90BEE9');
    this.scaffold = {
      titleHeight: 36,
      width: this.svgContainer.clientWidth,
      height: 400,
      margins: {
        bottom: 30,
        left: 30,
        right: 30,
        top: 30,
      },
      xAxisTop: 30,
      xAxisBottom: 30,
      yAxisLeft: 30,
      yAxisRight: 30,
      panelsContainer: undefined,
      panels: undefined
    };

    this.scaffold.width = this.svgContainer.clientWidth;
    this.scaffold.height = this.svgContainer.clientHeight;

    console.log(
      '%c     ✔ create ChartScaffold',
      'color:#90BEE9',
      this.scaffold.width,
      'x',
      this.scaffold.height
    );
  }

  private sizeChartElements(): void {
    console.log('%c     ✔  createScales', 'color:#90BEE9');
    const pc = this.scaffold.panelsContainer;
    if (!pc) return;
    console.log('%c     ✔ size ChartElements', 'color:#90BEE9');

    //select(this.rSvgElement.nativeElement)
    //  .attr('width', this.scaffold.width)
    //  .attr('height', this.scaffold.height);

    select(this.rChartTitle.nativeElement)
      .attr('width', this.scaffold.width)
      .attr('height', this.scaffold.titleHeight);

    select(this.rAxisTop.nativeElement)
      .attr('width', this.scaffold.width)
      .attr('height', this.scaffold.xAxisTop);

    select(this.xAxisBottomRect.nativeElement)
      .attr('width', this.scaffold.width)
      .attr('height', this.scaffold.xAxisBottom);
  }

  private alignMainChartElements(): void {
    console.log('%c     ✔  alighMainChartElements', 'color:#90BEE9');
    const pc = this.scaffold.panelsContainer;
    if (!pc) return;

    select(this.gPanelsContainer.nativeElement)
      .classed('panels-container', true);

    select(this.tChartTitleText.nativeElement)
      .attr('y', this.scaffold.titleHeight / 2)
      .attr('x', this.scaffold.width / 2);

    select(this.gAxisTop.nativeElement)
      .attr('transform', `translate(0, ${this.scaffold.titleHeight})`);

    select(this.gAxisTopMonths.nativeElement)
      .attr(
        'transform',
        `translate(${this.scaffold.yAxisLeft}, ${this.scaffold.xAxisTop})`
      );

    select(this.gXaxisBottom.nativeElement)
      .attr(
        'transform',
        `translate(${this.scaffold.yAxisLeft}, ${this.scaffold.height - this.scaffold.xAxisBottom})`
      );
  }

  private sizeAndPlacePanels(): void {
    console.log('%c     ✔  sizeAndPlacePanels', 'color:#fdf0d5');
    const proportions = [0.4, 0.2, 0.2, 0.2];
    const includedConfigs = chartConfig.filter(c => c.include);
    const includedCount = includedConfigs.length;

    const panelDefinitions = includedConfigs.map((configEntry, index) => ({
      id: configEntry.type,
      chartType: configEntry.type,
      ratio: proportions[index] ?? (1 / Math.max(1, includedCount)),
      showTitle: false,
      showAxisLeft: true,
      showAxisRight: true,
      showXAxisTop: false,
      showXAxisBottom: index === includedCount - 1
    }));

    const request: ChartLayoutRequest = {
      width: this.scaffold.width,
      height: this.scaffold.height,
      margins: this.scaffold.margins,
      titleHeight: this.scaffold.titleHeight,
      axisLeftWidth: this.scaffold.yAxisLeft,
      axisRightWidth: this.scaffold.yAxisRight,
      xAxisTopHeight: this.scaffold.xAxisTop,
      xAxisBottomHeight: this.scaffold.xAxisBottom,
      panelGap: 0,
      panels: panelDefinitions
    };

    const resolvedScaffold = this.layoutService.buildScaffold(request);

    // ✅ ASSIGN FIRST (critical)
    this.scaffold.panelsContainer = resolvedScaffold.panelsContainer;
    this.scaffold.panels = resolvedScaffold.panels;

    // ✅ NOW log the real data
    console.log('✅ panelsContainer', this.scaffold.panelsContainer);
    console.log('✅ panels', this.scaffold.panels);

    const pc = this.scaffold.panelsContainer;
    if (!pc) return;

    // ✅ POSITION the container (THIS WAS MISSING)
    select(this.gPanelsContainer.nativeElement)
      .attr('transform', `translate(${pc.x}, ${pc.y})`);



    // ✅ sanity check
    const panelsMap = this.scaffold.panels;
    if (!pc || !panelsMap) return;

    const panelList = Object.values(panelsMap).filter(
      (panel): panel is NonNullable<typeof panel> => !!panel
    );

    const totalPanelHeight = panelList.reduce((sum, panel) => {
      return sum + (panel?.panelRect.height ?? 0);
    }, 0);

    console.log('%cPanelsContainer sanity check', 'color:#90BEE9', {
      panelsContainerHeight: pc.height,
      totalPanelHeight,
      difference: pc.height - totalPanelHeight
    });

    // ✅ render panels RELATIVE to container
    const panelRefs: Array<ElementRef<SVGGElement> | undefined> = [
      this.panel1,
      this.panel2,
      this.panel3,
      this.panel4
    ];

    panelRefs.forEach((ref, index) => {
      if (!ref) return;

      const configEntry = includedConfigs[index];
      if (!configEntry) return;

      const panel = this.scaffold.panels?.[configEntry.type];
      if (!panel) return;

      // 🔑 KEY FIX: subtract container origin
      const localX = panel.panelRect.x - pc.x;
      const localY = panel.panelRect.y - pc.y;

      select(ref.nativeElement)
        .attr('transform', `translate(${localX}, ${localY})`);

      select(ref.nativeElement)
        .select('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', panel.panelRect.width)
        .attr('height', panel.panelRect.height);
    });

    this.panelViewModels = this.layoutService.buildPanelViewModels(request);

    console.log('%c✔ sizeAndPlacePanels FIXED', 'color:#90BEE9');
  }

  private createScales(): void {
    console.log('%c     ✔  createScales', 'color:#90BEE9');
    const panel = this.scaffold.panels?.[ChartType.OHLC];
    if (!panel) return;

    const contentWidth = Math.max(0, panel.contentRect.width ?? 0);

    const raw = this.chartData.stockPriceHistoryData ?? [];
    const dates: Date[] = raw.map(d =>
      d.date instanceof Date ? d.date : new Date(d.date)
    );

    this.dateScaleX = scaleBand<Date>()
      .domain(dates)
      .range([0, contentWidth])
      .paddingInner(0.2)
      .paddingOuter(0.1)
      .align(0.5);
  }

  private drawAxes(): void {
    console.log('%c     ✔  drawAxes', 'color:#90BEE9');

    this.xAxisMonthsBottom = select(this.xAxisMonthsBottomRef.nativeElement);

    const dateFormatterMajor = timeFormat('%b %Y');

    let lastMonthTop = -1;
    let lastYearTop = -1;

    let lastMonthBottom = -1;
    let lastYearBottom = -1;

    type CustomAxisDomain = string | number | Date | { valueOf(): number };

    this.chartXaxisMonthsTop = axisTop(this.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain) => {
        let date: Date;

        if (typeof domainValue === 'string') {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === 'number') {
          date = new Date(domainValue);
        } else {
          return '';
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonthTop || currentYear !== lastYearTop) {
          lastMonthTop = currentMonth;
          lastYearTop = currentYear;
          return `${dateFormatterMajor(date)}`;
        }

        return '';
      });

    this.chartXaxisMonthsBottom = axisBottom(this.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain) => {
        let date: Date;

        if (typeof domainValue === 'string') {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === 'number') {
          date = new Date(domainValue);
        } else {
          return '';
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonthBottom || currentYear !== lastYearBottom) {
          lastMonthBottom = currentMonth;
          lastYearBottom = currentYear;
          return `${dateFormatterMajor(date)}`;
        }

        return '';
      });

    select(this.gAxisTopMonths.nativeElement).call(this.chartXaxisMonthsTop);
    this.xAxisMonthsBottom.call(this.chartXaxisMonthsBottom);
  }

  showError(error: any): void {
    //this.popover_loading.hide();
    //this.popover_httperror.error = error.error;
    //this.popover_httperror.headers = error.headers;
    //this.popover_httperror.message = error.message;
    //this.popover_httperror.name = error.name;
    //this.popover_httperror.ok = error.ok;
    //this.popover_httperror.status = error.status;
    //this.popover_httperror.statusText = error.statusText;
    //this.popover_httperror.url = error.url;
    //this.popover_httperror.show();
  }

  drawRsi(): void {
    // Future integration point.
  }
}
