/* technical-analysis.component.ts */

// #region imports
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

// #region imports

import { take, takeUntil } from 'rxjs/operators';
import { Axis, axisBottom, axisTop } from 'd3-axis';
import { select, Selection } from 'd3-selection';
import { scaleBand, type ScaleBand } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DivRect } from './interfaces/common-interfaces';
import { HtmlElementOverlayContainer } from '../../overlays/html-element-overlay-container'

import { ChartType } from './enums/chart-type';
import { ChartComponentMap } from './maps/chart-component-map';
import { ChartDataService } from './services/chart-data.service';
import { ChartScaffoldService } from './services/chart-scaffold.service';
import { MacdDrawService } from './services/charts/macd/macd-draw.service';
import { MacdLayoutService } from './services/charts/macd/macd-layout.service';
import { OhlcChartLayoutService } from './services/charts/ohlc/ohlc-chart-layout.service';
import { RsiChartLayoutService } from './services/charts/rsi/rsi-chart-layout.service';
import { VolumeChartLayoutService } from './services/charts/volume/volume-chart-layout.service';
import { PanelLayoutService } from './engine/layout/panel-layout.service';
import { TechnicalAnalysisService } from './technical-analysis.service';
import type { PanelAttributes, PanelDefinition, PanelViewModel } from './interfaces/panel-interfaces';
import { ChartLayoutRequest } from './interfaces/chart-layout-request.interface';
import { PanelHostService } from '../../../_framework/layout/panel-workspace/services/panel-host.service';
import { PanelPreference } from './interfaces/panel-preference.interface';
import { PanelPreferenceService } from '../../../_framework/layout/panel-workspace/services/panel-preference.service';
import { Subject } from 'rxjs';
import { ChartScaffold } from './interfaces/chart-scafffold.interface';
import { JzPopoverLoadingComponent } from '../../../_framework/ui/popovers/jz-popover-loading/jz-popover-loading.component';
import { JzPopoverRef } from '../../../_framework/ui/popovers/jz-popover-ref';
import { JzPopoverService } from '../../../_framework/ui/popovers/jz-popover.service';
import { JzPopoverErrorComponent } from '../../../_framework/ui/popovers/jz-popover-error/jz-popover-error.component';
import { buildJzPopoverErrorData } from '../../../_framework/ui/popovers/jz-popover-error/jz-popover-error-utils';

// #endregion imports

export function createHtmlElementOverlayContainer(host: ElementRef): OverlayContainer {
  return new HtmlElementOverlayContainer(host.nativeElement);
}

@Component({ // TechnicalAnalysisComponent
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
export class TechnicalAnalysisComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent';

  // #region @ViewChild List
  @ViewChild('divSvgContainer', { static: false }) divSvgContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('rSvgElement', { static: false }) rSvgElement!: ElementRef<SVGRectElement>;

  @ViewChild('gChartTitle', { static: false }) gChartTitle!: ElementRef<SVGGElement>;
  @ViewChild('rChartTitle', { static: false }) rChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('tChartTitleText', { static: false }) tChartTitleText!: ElementRef<SVGTextElement>;

  @ViewChild('gAxisTop', { static: false }) gAxisTop!: ElementRef<SVGGElement>;
  @ViewChild('rAxisTop', { static: false }) rAxisTop!: ElementRef<SVGRectElement>;
  @ViewChild('rAxisTopMonths', { static: false }) rAxisTopMonths!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisTopRect', { static: false }) xAxisTopRect!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisTopMonths', { static: false }) gAxisTopMonths!: ElementRef<SVGGElement>;
  @ViewChild('xAxisDays', { static: false }) xAxisDaysRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisBottom', { static: false }) gAxisBottom!: ElementRef<SVGGElement>;
  @ViewChild('rAxisBottom', { static: false }) rAxisBottom!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisBottomMonths', { static: false }) gAxisBottomMonths!: ElementRef<SVGGElement>;
  //@ViewChild('gAxisBottom', { static: false }) gAxisBottom!: ElementRef<SVGGElement>;
  /*  @ViewChild('xAxisGroupBottom', { static: false }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;*/

  @ViewChild('gPanelHostsContainer', { static: false }) gPanelHostsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rPanelHostsContainer', { static: false }) rPanelHostsContainer!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisGroupLeft', { static: false }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('panel1', { static: false }) panel1!: ElementRef<SVGGElement>;
  @ViewChild('panel2', { static: false }) panel2!: ElementRef<SVGGElement>;
  @ViewChild('panel3', { static: false }) panel3!: ElementRef<SVGGElement>;
  @ViewChild('panel4', { static: false }) panel4!: ElementRef<SVGGElement>;

  @Input() chartTitle: any = 'Technical Analysis Chart';

  // #endregion @ViewChild List

  // #region Properties
  ChartType = ChartType;
  private readonly destroyed$ = new Subject<void>();
  width = 0;

  chartScaffold!: ChartScaffold;
  panelViewModels: PanelViewModel[] = [];

  dataReady = false;
  viewReady = false;
  hydrated = false;
  ticker = 'NVDA';

  dateScaleX!: ScaleBand<Date>;

  chartXaxisMonthsTop!: Axis<Date>;
  chartXaxisMonthsBottom!: Axis<Date>;
  xAxisMonthsBottom!: Selection<SVGGElement, unknown, null, undefined>;
  svgContainer!: HTMLDivElement;
  xAxisDays: any;
  xAxisBottom: any;

  private loadingPopoverRef?: JzPopoverRef;
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
    private scaffoldSvc: ChartScaffoldService,
    private panelPreferenceService: PanelPreferenceService,
    private popoverService: JzPopoverService
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

  ngOnInit(): void {
    this.panelPreferenceService.preferences$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(preferences => {
        this.applyPanelPreferences(preferences);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {

    this.updateSvgSize();
    window.addEventListener('resize', this.updateSvgSize.bind(this));
    this.fetchData();

    this.viewReady = true;
    this.initializeChartWhenReady();

    console.log('%c   🔵 ngAfterViewInit TechanTsComponent', 'color:##EDF6F9');
  }

  private updateSvgSize(): void {

    this.svgContainer = this.divSvgContainer.nativeElement;

    select(this.svgElement.nativeElement)
      .attr('width', this.divSvgContainer.nativeElement.clientWidth - 5)
      .attr('height', this.divSvgContainer.nativeElement.clientHeight - 2);

    select(this.rSvgElement.nativeElement)
      .attr('width', this.divSvgContainer.nativeElement.clientWidth)
      .attr('height', this.divSvgContainer.nativeElement.clientHeight);


    console.log('%c     svgElement ', 'color:#8fb996', this.svgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
    console.log('%c     rSvgElement', 'color:#D9B208', this.rSvgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
  }

  private renderOuterScaffoldOnce(): void {
    const scaffold = this.chartScaffold;
    select(this.rChartTitle.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr('height', scaffold.titleHeight)

    select(this.tChartTitleText.nativeElement)
      .attr('x', scaffold.width / 2)
      .attr('y', scaffold.titleHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'gray')
      .text(this.chartTitle);

    select(this.gAxisTop.nativeElement)
      .attr('transform', `translate(${scaffold.margins.left}, ${scaffold.titleHeight})`);

    select(this.gAxisTopMonths.nativeElement)
      .attr('transform', `translate(0, ${scaffold.titleHeight - 7})`);

    select(this.rAxisTop.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width - scaffold.margins.left - scaffold.margins.right)
      .attr('height', scaffold.xAxisTop);

    select(this.gPanelHostsContainer.nativeElement)
      .attr('transform', `translate(0,  ${scaffold.titleHeight + scaffold.xAxisTop})`);

    select(this.rPanelHostsContainer.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr('height', scaffold.height - scaffold.titleHeight - scaffold.xAxisTop - scaffold.xAxisBottom);

    select(this.gAxisBottom.nativeElement)
      .attr('transform', `translate(${scaffold.margins.left}, ${scaffold.height - scaffold.xAxisBottom})`);

    select(this.rAxisBottom.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width - scaffold.margins.left - scaffold.margins.right)
      .attr('height', scaffold.xAxisBottom);
  }

  private fetchData(): void {
    console.log('%c     ✔  fetchData', 'color:#90BEE9');
    const viewRouter =
      new ElementRef(
        document.getElementById('viewRouter') as HTMLElement
      );
    // show loading popover
    this.loadingPopoverRef = this.popoverService.openComponent(
      viewRouter,
      JzPopoverLoadingComponent,
      {
        placement: 'center',
        data: {
          title: 'Loading Market Data',
          message: `Loading ${this.ticker}...`
        }
      }
    );

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

  private showError(error: unknown): void {

    this.loadingPopoverRef?.close();

    const viewRouter = new ElementRef(
      document.getElementById('viewRouter') as HTMLElement
    );

    this.popoverService.openComponent(
      viewRouter,
      JzPopoverErrorComponent,
      {
        placement: 'center',
        data: buildJzPopoverErrorData(error)
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
      this.renderOuterScaffoldOnce();
      this.sizeChartElements();
      this.createScales();
      this.drawAxes();

      this.applyPanelPreferences(this.panelPreferenceService.getPreferences());

      this.scaffoldSvc.scaffold = this.chartScaffold;
      this.injectConfiguredPanels();
    });
  }

  private injectConfiguredPanels(): void {
    const chartMap = this.chartScaffold?.chartMap;
    if (!chartMap) return;

    const preferences = this.panelPreferenceService.getPreferences()
      .filter(p => p.visible)
      .sort((a, b) => a.order - b.order);

    preferences.forEach(pref => {
      const panel = chartMap[pref.chartType];
      if (!panel) return;

      const host = this.gPanelHostsContainer.nativeElement.querySelector(
        `#panel-host-${panel.id}`
      ) as SVGGElement | null;

      if (!host) return;

      const chartComponent = ChartComponentMap[pref.chartType];
      if (!chartComponent) return;

      const compRef = this.panelHost.injectChartComponent(
        host,
        pref.chartType,
        chartComponent
      );

      compRef.setInput('data', this.chartData.stockPriceHistoryData);
      compRef.setInput('dateScaleX', this.dateScaleX);
      compRef.setInput('panel', panel);
      compRef.setInput('scaffold', this.chartScaffold);

      compRef.instance.markReadyAndDraw({
        dataReady: true,
        inputsInitialized: true,
        caller: 'injectConfiguredPanels'
      });

      compRef.changeDetectorRef.detectChanges();
    });
  }

  //private injectChartsFromConfig(): void {
  //  console.log('%c     ✔  injectChartsFromConfig', 'color:#90BEE9');
  //  const panelRefs = [this.panel1, this.panel2, this.panel3, this.panel4];

  //  chartConfig.forEach((configEntry, index) => {
  //    if (!configEntry.include) return;

  //    const chartComponent = ChartComponentMap[configEntry.type];
  //    const panelRef = panelRefs[index];

  //    if (!chartComponent || !panelRef) return;

  //    const compRef = this.panelHost.injectChartComponent(
  //      panelRef.nativeElement,
  //      configEntry.type,
  //      chartComponent
  //    );

  //    compRef.setInput('data', this.chartData.stockPriceHistoryData);
  //    compRef.setInput('dateScaleX', this.dateScaleX);
  ////    compRef.setInput('scaffold', this.scaffold);

  //    compRef.instance.markReadyAndDraw({
  //      dataReady: true,
  //      inputsInitialized: true,
  //      caller: 'injectChartsFromConfig'
  //    });

  //    compRef.changeDetectorRef.detectChanges();
  //  });
  //}

  private createChartScaffold(): void {
    console.log('%c     ✔  createChartScaffold', 'color:#90BEE9');

    const margins = {
      bottom: 30,
      left: 40,
      right: 40,
      top: 30,
    };

    this.chartScaffold = {
      titleHeight: 36,
      titleWidth: this.svgContainer.clientWidth,
      width: this.svgContainer.clientWidth,
      height: 400,
     margins,
      xAxisTop: 30,
      xAxisBottom: 30,
      //yAxisLeft: 40,
      //yAxisRight: 40,
      panelHostsContainer: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      chartMap: undefined
    };

    this.chartScaffold.width = this.svgContainer.clientWidth;
    this.chartScaffold.height = this.svgContainer.clientHeight;
    this.chartScaffold.panelHostsContainer!.width = this.svgContainer.clientWidth;

    //  console.log(
    //    '%c     ✔ create ChartScaffold',
    //    'color:#90BEE9',
    //    this.chartScaffold.width,
    //    'x',
    //    this.chartScaffold.height
    //  );
  }

  private sizeChartElements(): void {
    console.log('%c     ✔  createScales', 'color:#90BEE9');
    const pc = this.chartScaffold.panelHostsContainer;
    if (!pc) return;
    console.log('%c     ✔ size ChartElements', 'color:#90BEE9');

    //select(this.rSvgElement.nativeElement)
    //  .attr('width', this.chartScaffold.width)
    //  .attr('height', this.chartScaffold.height);

    select(this.rChartTitle.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.titleHeight);

    select(this.rAxisTop.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisTop);

    select(this.rAxisBottom.nativeElement)
      .attr('width', this.chartScaffold.width)
      .attr('height', this.chartScaffold.xAxisBottom);
  }

  private alignMainChartElements(): void {
    console.log('%c     ✔  alighMainChartElements', 'color:#90BEE9');
    const pc = this.chartScaffold.panelHostsContainer;
    if (!pc) return;

    select(this.gPanelHostsContainer.nativeElement)
      .classed('panels-container', true);

    //select(this.tChartTitleText.nativeElement)
    //  .attr('y', this.chartScaffold.titleHeight / 2)
    //  .attr('x', this.chartScaffold.width / 2);

    select(this.gAxisTop.nativeElement)
      .attr('transform', `translate(0, ${this.chartScaffold.titleHeight})`);

    select(this.gAxisTopMonths.nativeElement)
      .attr(
        'transform',
        `translate(${this.chartScaffold.margins.left}, ${this.chartScaffold.xAxisTop})`
      );

    select(this.gAxisBottom.nativeElement)
      .attr(
        'transform',
        `translate(${this.chartScaffold.margins.left}, ${this.chartScaffold.height - this.chartScaffold.xAxisBottom})`
      );
  }

  private createScales(): void {

    const contentWidth = Math.max(0, this.chartScaffold.width ?? 0);

    const raw = this.chartData.stockPriceHistoryData ?? [];
    const dates: Date[] = raw.map(d =>
      d.date instanceof Date ? d.date : new Date(d.date)
    );

    this.dateScaleX = scaleBand<Date>()
      .domain(dates)
      .range([0, contentWidth - this.chartScaffold.margins.left - this.chartScaffold.margins.right])
      .paddingInner(0.2)
      .paddingOuter(0.1)
      .align(0.5);
  }

  private drawAxes(): void {
    console.log('%c     ✔  drawAxes', 'color:#90BEE9');

    // this.gAxisBottomMonths = select(this.gAxisBottomMonths.nativeElement);

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
    select(this.gAxisBottomMonths.nativeElement).call(this.chartXaxisMonthsBottom);
  }

  private sizeAndPlacePanels(): void {

    const preferences = this.panelPreferenceService.getPreferences();
    const panelDefinitions = this.buildPanelDefinitions(preferences);

    const request: ChartLayoutRequest = {
      width: this.chartScaffold.width,
      height: this.chartScaffold.height,
      margins: this.chartScaffold.margins,
      titleWidth: this.chartScaffold.titleWidth,
      titleHeight: this.chartScaffold.titleHeight,
      axisLeftWidth: this.chartScaffold.margins.left,
      axisRightWidth: this.chartScaffold.margins.right,
      xAxisTopHeight: this.chartScaffold.xAxisTop,
      xAxisBottomHeight: this.chartScaffold.xAxisBottom,
      panelGap: 0,
      panels: panelDefinitions
    };

    const resolved = this.layoutService.buildScaffold(request);

    this.chartScaffold.panelHostsContainer = resolved.panelHostsContainer;
    this.chartScaffold.chartMap = resolved.chartMap;
  }

  private applyPanelPreferences(preferences: PanelPreference[]): void {
    if (!this.chartScaffold?.width || !this.chartScaffold?.height) return;

    const panelDefinitions = this.buildPanelDefinitions(preferences);

    const request: ChartLayoutRequest = {
      width: this.chartScaffold.width,
      height: this.chartScaffold.height,
      margins: this.chartScaffold.margins,
      titleWidth: this.chartScaffold.titleWidth,
      titleHeight: this.chartScaffold.titleHeight,
      axisLeftWidth: this.chartScaffold.margins.left,
      axisRightWidth: this.chartScaffold.margins.right,
      xAxisTopHeight: this.chartScaffold.xAxisTop,
      xAxisBottomHeight: this.chartScaffold.xAxisBottom,
      panelGap: 0,
      panels: panelDefinitions
    };

    const resolved = this.layoutService.buildScaffold(request);

    this.chartScaffold.panelHostsContainer = resolved.panelHostsContainer;
    this.chartScaffold.chartMap = resolved.chartMap;

    this.renderOuterScaffoldOnce();
    this.sizeChartElements();
    this.alignMainChartElements();
    this.renderPanelHosts();
  }

  private renderPanelHosts(): void {
    const panelsMap = this.chartScaffold?.chartMap;
    if (!panelsMap) return;

    const panels = Object.values(panelsMap).filter(
      (panel): panel is PanelAttributes => !!panel
    );

    const container = select(this.gPanelHostsContainer.nativeElement);

    const hosts = container
      .selectAll<SVGGElement, PanelAttributes>('g.panel-host')
      .data(panels, (d: PanelAttributes) => d.id);

    hosts.exit().remove();

    const enter = hosts
      .enter()
      .append('g')
      .attr('class', 'panel-host');

    enter.append('rect')
      .attr('class', 'panel-debug');

    const merged = enter.merge(hosts as any);

    merged
      .attr('id', d => `panel-host-${d.id}`)
      .attr('data-panel-id', d => d.id)
      .attr('transform', d => `translate(${d.panelRect.x}, ${d.panelRect.y})`);

    merged.select<SVGRectElement>('rect.panel-debug')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', d => Math.max(0, d.panelRect.width))
      .attr('height', d => Math.max(0, d.panelRect.height))
      .attr('fill', 'rgba(0, 128, 255, 0.1)');
   //   .attr('stroke', 'yellow');
  }

  private buildPanelDefinitions(
    preferences: PanelPreference[]
  ): PanelDefinition[] {
    const visiblePrefs = preferences
      .filter(p => p.visible)
      .sort((a, b) => a.order - b.order);

    return visiblePrefs.map((pref, index) => ({
      id: pref.id,
      chartType: pref.chartType,
      ratio: pref.ratio,
      showAxisLeft: pref.showAxisLeft ?? true,
      showAxisRight: pref.showAxisRight ?? false,
      showXAxisTop: pref.showXAxisTop ?? false,
      showXAxisBottom:
        pref.showXAxisBottom ?? index === visiblePrefs.length - 1
    }));
  }

}
