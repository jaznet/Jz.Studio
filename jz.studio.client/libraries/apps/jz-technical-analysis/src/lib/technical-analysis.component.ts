/* technical-analysis.component.ts */

// #region imports
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ChartScaffoldBuilderService } from './engine/layout/chart-scaffold-builder.service';
import { PanelWorkspaceLayoutService } from './engine/layout/panel-workspace-layout.service';
import { ChartPanelRendererService } from './engine/rendering/chart-panel-renderer.service';
import { ChartScaffoldRendererService } from './engine/rendering/chart-scaffold-renderer.service';
import { ChartXAxisService } from './engine/rendering/chart-x-axis.service';
import { PanelHostRendererService } from './engine/rendering/panel-host-renderer.service';
import { ChartType } from './enums/chart-type';
import { ChartScaffold } from './interfaces/chart-scaffold.interface';
import { PanelAttributes } from './interfaces/panel-interfaces';
import { PanelPreference } from './interfaces/panel-preference.interface';
import { StockPriceHistory } from './models/stock-price-history.model';
import { TechnicalAnalysisDataWindow } from './models/technical-analysis-data.model';
import { ChartDataService } from './services/chart-data.service';
import { ChartScaffoldService } from './services/chart-scaffold.service';
import { ChartCrosshairService } from './services/interactions/chart-crosshair.service';
import { HtmlElementOverlayContainer } from './support/overlays/html-element-overlay-container';
import { PanelHostService } from './support/panel-workspace/panel-host.service';
import { PanelPreferenceService } from './support/panel-workspace/panel-preference.service';

// #endregion imports

export function createHtmlElementOverlayContainer(host: ElementRef): OverlayContainer {
  return new HtmlElementOverlayContainer(host.nativeElement);
}

@Component({ // TechnicalAnalysisComponent
  selector: 'jz-technical-analysis',
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

  @ViewChild('gAxisTop', { static: false }) gAxisTop!: ElementRef<SVGGElement>;
  @ViewChild('rAxisTop', { static: false }) rAxisTop!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisTopMonths', { static: false }) gAxisTopMonths!: ElementRef<SVGGElement>;

  @ViewChild('gAxisBottom', { static: false }) gAxisBottom!: ElementRef<SVGGElement>;
  @ViewChild('rAxisBottom', { static: false }) rAxisBottom!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisBottomMonths', { static: false }) gAxisBottomMonths!: ElementRef<SVGGElement>;

  @ViewChild('gPanelHostsContainer', { static: false }) gPanelHostsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rPanelHostsContainer', { static: false }) rPanelHostsContainer!: ElementRef<SVGRectElement>;

  @Input()
  set dataWindow(value: TechnicalAnalysisDataWindow | undefined) {
    this.configuredWindow = value;
    this.visibleWindow = value;
    this.maximumViewportDays = undefined;
    this.loadData(this.sourceData);
  }

  @Input()
  set stockPriceHistoryData(value: StockPriceHistory[] | null | undefined) {
    this.visibleWindow = this.configuredWindow;
    this.maximumViewportDays = undefined;
    this.loadData(value ?? []);
  }

  get stockPriceHistoryData(): StockPriceHistory[] {
    return this.chartData.stockPriceHistoryData;
  }

  // #endregion @ViewChild List

  // #region Properties
  private readonly destroyed$ = new Subject<void>();
  private readonly chartComponentRefs: ComponentRef<unknown>[] = [];
  private resizeObserver?: ResizeObserver;
  private resizeFrame?: number;
  private viewportWidth = 0;
  private viewportHeight = 0;
  private sourceData: StockPriceHistory[] = [];
  private configuredWindow?: TechnicalAnalysisDataWindow;
  private visibleWindow?: TechnicalAnalysisDataWindow;
  private maximumViewportDays?: number;
  private activeCrosshairChartType?: ChartType;
  private activeCrosshairPanel?: PanelAttributes;
  private wheelZoomTimer?: number;
  private wheelZoomDelta = 0;
  private wheelZoomAnchorRatio = 0.5;
  private viewportDragPointerId?: number;
  private viewportDragStartX = 0;
  private viewportDragLatestX = 0;
  private viewportPanFrame?: number;
  private suppressNextChartClick = false;

  chartScaffold: ChartScaffold = {
    width: 0,
    height: 0,
    xAxisTop: 0,
    xAxisBottom: 0,
    margins: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };
  dataReady = false;
  viewReady = false;
  hydrated = false;
  crosshairVisible = false;
  crosshairPinned = false;
  crosshairX = 0;
  crosshairY = 0;
  crosshairTop = 0;
  crosshairBottom = 0;
  crosshairLeft = 0;
  crosshairRight = 0;
  crosshairDateLabel = '';
  crosshairDateLabelX = 0;
  crosshairDateLabelY = 0;
  crosshairValueLabel = '';
  crosshairValueLabelX = 0;
  crosshairValueLabelY = 0;
  viewportPannable = false;
  viewportDragging = false;
  viewportRangeLabel = '';

  dateScaleX!: ScaleBand<Date>;
  svgContainer!: HTMLDivElement;

  // #endregion Properties

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    public chartData: ChartDataService,
    private chartScaffoldBuilder: ChartScaffoldBuilderService,
    private panelWorkspaceLayout: PanelWorkspaceLayoutService,
    private panelHost: PanelHostService,
    private chartPanelRenderer: ChartPanelRendererService,
    private chartScaffoldRenderer: ChartScaffoldRendererService,
    private chartXAxis: ChartXAxisService,
    private panelHostRenderer: PanelHostRendererService,
    private scaffoldSvc: ChartScaffoldService,
    private panelPreferenceService: PanelPreferenceService,
    private crosshairService: ChartCrosshairService
  ) {
    console.log('');
    console.log('%c ---------- Technical Analysis Chart ----------', 'color: #D9B208');
    console.log('%c⛏️ XTOR Technical Analysis Component', 'color: #D9B208');

    document.documentElement.style.setProperty('--plt-chart-1', '#12100e');
    document.documentElement.style.setProperty('--plt-chart-2', '#8B8B84');
    document.documentElement.style.setProperty('--plt-chart-3', '#85ad90');
    document.documentElement.style.setProperty('--plt-chart-4', '#6FA288');
    document.documentElement.style.setProperty('--plt-chart-5', '#a9927d');
  }

  ngOnInit(): void {
    this.panelPreferenceService.preferences$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(preferences => {
        this.applyPanelPreferences(preferences);
      });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeFrame !== undefined) {
      window.cancelAnimationFrame(this.resizeFrame);
    }
    if (this.wheelZoomTimer !== undefined) {
      window.clearTimeout(this.wheelZoomTimer);
    }
    if (this.viewportPanFrame !== undefined) {
      window.cancelAnimationFrame(this.viewportPanFrame);
    }
    this.destroyChartComponents();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    this.updateSvgSize();
    this.viewportWidth = this.svgContainer.clientWidth;
    this.viewportHeight = this.svgContainer.clientHeight;
    this.resizeObserver = new ResizeObserver(() => this.queueChartResize());
    this.resizeObserver.observe(this.svgContainer);

    this.viewReady = true;
    this.tryCreateChart();

    console.log('%c   🔵 ngAfterViewInit TechnicalAnalysisComponent', 'color:##EDF6F9');
  }

  onChartPointerMove(event: PointerEvent): void {
    if (this.viewportDragPointerId !== undefined) {
      this.updateViewportDrag(event);
      return;
    }
    if (this.crosshairPinned) return;
    this.updateCrosshair(event);
  }

  onChartPointerDown(event: PointerEvent): void {
    if (
      !this.viewportPannable
      || event.button !== 0
      || !this.isPointerOverPlot(event)
    ) {
      return;
    }

    this.viewportDragPointerId = event.pointerId;
    this.viewportDragStartX = event.clientX;
    this.viewportDragLatestX = event.clientX;
    this.viewportDragging = false;
    this.svgElement.nativeElement.setPointerCapture(event.pointerId);
  }

  onChartPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.viewportDragPointerId) return;

    const dragDistance = event.clientX - this.viewportDragStartX;
    const wasDragging = this.viewportDragging;
    if (this.viewportPanFrame !== undefined) {
      window.cancelAnimationFrame(this.viewportPanFrame);
      this.viewportPanFrame = undefined;
    }
    if (wasDragging) {
      this.applyViewportPan(dragDistance);
    }
    this.endViewportDrag(event.pointerId);

    if (!wasDragging) return;

    this.suppressNextChartClick = true;
    window.setTimeout(() => {
      this.suppressNextChartClick = false;
    });
  }

  onChartPointerCancel(event: PointerEvent): void {
    if (event.pointerId === this.viewportDragPointerId) {
      this.endViewportDrag(event.pointerId);
    }
  }

  onChartClick(event: MouseEvent): void {
    if (this.suppressNextChartClick) {
      this.suppressNextChartClick = false;
      return;
    }
    this.crosshairPinned = false;
    this.updateCrosshair(event);
    this.crosshairPinned = this.crosshairVisible;
  }

  onChartPointerLeave(): void {
    if (this.viewportDragPointerId !== undefined) return;
    if (!this.crosshairPinned) {
      this.hideCrosshair();
    }
  }

  onChartWheel(event: WheelEvent): void {
    if (this.viewportDragPointerId !== undefined) return;
    const svg = this.svgElement?.nativeElement;
    const matrix = svg?.getScreenCTM();
    const panelsMap = this.chartScaffold.chartMap;
    if (!svg || !matrix || !panelsMap || !this.dateScaleX) return;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const pointer = svgPoint.matrixTransform(matrix.inverse());

    const plotLeft = this.chartScaffold.margins.left;
    const plotRight = this.chartScaffold.width - this.chartScaffold.margins.right;
    const overPanel = Object.values(panelsMap).some(panel => {
      if (!panel) return false;
      const contentTop = this.chartScaffold.xAxisTop + panel.contentRect.y;
      const contentBottom = contentTop + panel.contentRect.height;
      return pointer.y >= contentTop && pointer.y <= contentBottom;
    });

    if (pointer.x < plotLeft || pointer.x > plotRight || !overPanel) return;

    event.preventDefault();
    this.wheelZoomDelta += event.deltaY;
    this.wheelZoomAnchorRatio = Math.min(
      1,
      Math.max(0, (pointer.x - plotLeft) / Math.max(1, plotRight - plotLeft))
    );

    if (this.wheelZoomTimer !== undefined) {
      window.clearTimeout(this.wheelZoomTimer);
    }
    this.wheelZoomTimer = window.setTimeout(() => {
      this.applyWheelZoom();
    }, 60);
  }

  onChartDoubleClick(event: MouseEvent): void {
    if (!this.viewportPannable || !this.isPointerOverPlot(event)) return;

    event.preventDefault();
    this.resetViewport();
  }

  onResetViewControl(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.resetViewport();
  }

  onResetViewPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.suppressNextChartClick = true;
    this.resetViewport();
    window.setTimeout(() => {
      this.suppressNextChartClick = false;
    });
  }

  private resetViewport(): void {
    if (!this.viewportPannable) return;

    if (this.wheelZoomTimer !== undefined) {
      window.clearTimeout(this.wheelZoomTimer);
      this.wheelZoomTimer = undefined;
      this.wheelZoomDelta = 0;
    }

    this.crosshairPinned = false;
    this.hideCrosshair();
    this.viewportPannable = false;
    this.visibleWindow = this.configuredWindow;
    this.loadData(this.sourceData);
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.releasePinnedCrosshair();
      return;
    }

    if (
      this.isEditableKeyboardTarget(event.target)
      || event.ctrlKey
      || event.altKey
      || event.metaKey
    ) {
      return;
    }

    if (event.key === 'Home') {
      if (!this.viewportPannable) return;
      event.preventDefault();
      this.resetViewport();
      return;
    }

    if (
      event.key === '+' || event.key === '=' || event.key === '-'
    ) {
      event.preventDefault();
      this.applyViewportZoom(event.key === '-' ? 100 : -100, 0.5);
      return;
    }

    if (
      !this.crosshairPinned
      || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    ) {
      return;
    }

    event.preventDefault();
    this.movePinnedCrosshair(event.key === 'ArrowLeft' ? -1 : 1);
  }

  releasePinnedCrosshair(): void {
    if (!this.crosshairPinned) return;
    this.crosshairPinned = false;
    this.hideCrosshair();
  }

  private movePinnedCrosshair(direction: -1 | 1): void {
    const currentDate = this.crosshairService.state().coordinate?.date;
    const panel = this.activeCrosshairPanel;
    const chartType = this.activeCrosshairChartType;
    if (!currentDate || !panel || !chartType || !this.dateScaleX) return;

    const dates = this.dateScaleX.domain();
    const currentIndex = dates.findIndex(
      date => date.getTime() === currentDate.getTime()
    );
    if (currentIndex < 0) return;

    const nextIndex = Math.min(
      dates.length - 1,
      Math.max(0, currentIndex + direction)
    );
    if (nextIndex === currentIndex) return;

    const nextDate = dates[nextIndex];
    const bandX = this.dateScaleX(nextDate);
    const readout = this.chartData.getCrosshairReadout(nextDate);
    if (bandX === undefined || !readout) return;

    const plotLeft = this.chartScaffold.margins.left;
    const plotRight = this.chartScaffold.width - this.chartScaffold.margins.right;

    this.crosshairX = plotLeft + bandX + this.dateScaleX.bandwidth() / 2;
    this.updateCrosshairCallouts(
      nextDate,
      this.crosshairY,
      chartType,
      panel,
      plotLeft,
      plotRight
    );
    this.crosshairService.show(
      { date: nextDate, value: readout.close },
      readout
    );
  }

  private applyWheelZoom(): void {
    const delta = this.wheelZoomDelta;
    const anchorRatio = this.wheelZoomAnchorRatio;
    this.wheelZoomDelta = 0;
    this.wheelZoomTimer = undefined;
    this.applyViewportZoom(delta, anchorRatio);
  }

  private applyViewportZoom(delta: number, anchorRatio: number): void {
    if (delta === 0 || !this.dateScaleX) return;

    const visibleDates = this.dateScaleX.domain();
    const allDates = this.chartData.calculationData.map(item => item.date);
    if (visibleDates.length === 0 || allDates.length === 0) return;

    const maximumVisibleDays = Math.min(
      this.maximumViewportDays ?? allDates.length,
      allDates.length
    );
    const minimumVisibleDays = Math.min(30, maximumVisibleDays);
    const zoomSteps = Math.max(-4, Math.min(4, delta / 100));
    const zoomFactor = Math.pow(1.2, zoomSteps);
    const nextCount = Math.min(
      maximumVisibleDays,
      Math.max(minimumVisibleDays, Math.round(visibleDates.length * zoomFactor))
    );
    if (nextCount === visibleDates.length) return;

    const visibleStartTimestamp = visibleDates[0].getTime();
    const currentStartIndex = Math.max(
      0,
      allDates.findIndex(date => date.getTime() === visibleStartTimestamp)
    );
    const anchorIndex = currentStartIndex + Math.round(
      anchorRatio * Math.max(0, visibleDates.length - 1)
    );
    const unclampedStart = Math.round(
      anchorIndex - anchorRatio * Math.max(0, nextCount - 1)
    );
    const nextStartIndex = Math.min(
      allDates.length - nextCount,
      Math.max(0, unclampedStart)
    );
    const nextEndIndex = nextStartIndex + nextCount - 1;

    this.crosshairPinned = false;
    this.hideCrosshair();
    this.viewportPannable = nextCount < maximumVisibleDays;
    this.visibleWindow = nextCount === maximumVisibleDays
      ? this.configuredWindow
      : {
          visibleStart: allDates[nextStartIndex],
          visibleEnd: allDates[nextEndIndex]
        };
    this.loadData(this.sourceData);
  }

  private isEditableKeyboardTarget(target: EventTarget | null): boolean {
    return target instanceof HTMLElement
      && !!target.closest('input, textarea, select, button, [contenteditable="true"]');
  }

  private updateViewportDrag(event: PointerEvent): void {
    if (event.pointerId !== this.viewportDragPointerId) return;

    this.viewportDragLatestX = event.clientX;
    if (Math.abs(event.clientX - this.viewportDragStartX) >= 5) {
      if (!this.viewportDragging) {
        this.viewportDragging = true;
        this.crosshairPinned = false;
        this.hideCrosshair();
      }
      event.preventDefault();
      this.scheduleViewportPan();
    }
  }

  private scheduleViewportPan(): void {
    if (this.viewportPanFrame !== undefined) return;

    this.viewportPanFrame = window.requestAnimationFrame(() => {
      this.viewportPanFrame = undefined;
      const dragDistance = this.viewportDragLatestX - this.viewportDragStartX;
      if (this.applyViewportPan(dragDistance)) {
        this.viewportDragStartX = this.viewportDragLatestX;
      }
    });
  }

  private endViewportDrag(pointerId: number): void {
    if (this.viewportPanFrame !== undefined) {
      window.cancelAnimationFrame(this.viewportPanFrame);
      this.viewportPanFrame = undefined;
    }
    const svg = this.svgElement?.nativeElement;
    if (svg?.hasPointerCapture(pointerId)) {
      svg.releasePointerCapture(pointerId);
    }
    this.viewportDragPointerId = undefined;
    this.viewportDragging = false;
  }

  private applyViewportPan(dragDistance: number): boolean {
    const visibleDates = this.dateScaleX?.domain() ?? [];
    const allDates = this.chartData.calculationData.map(item => item.date);
    if (visibleDates.length === 0 || allDates.length === 0) return false;

    const svgWidth = Math.max(
      1,
      this.svgElement.nativeElement.getBoundingClientRect().width
    );
    const plotWidth = Math.max(
      1,
      this.chartScaffold.width
      - this.chartScaffold.margins.left
      - this.chartScaffold.margins.right
    );
    const plotClientWidth = plotWidth * svgWidth / this.chartScaffold.width;
    const dayShift = Math.round(
      -dragDistance / plotClientWidth * visibleDates.length
    );
    if (dayShift === 0) return false;

    const currentStartTimestamp = visibleDates[0].getTime();
    const currentStartIndex = allDates.findIndex(
      date => date.getTime() === currentStartTimestamp
    );
    if (currentStartIndex < 0) return false;

    const nextStartIndex = Math.min(
      allDates.length - visibleDates.length,
      Math.max(0, currentStartIndex + dayShift)
    );
    if (nextStartIndex === currentStartIndex) return true;

    const nextEndIndex = nextStartIndex + visibleDates.length - 1;
    this.visibleWindow = {
      visibleStart: allDates[nextStartIndex],
      visibleEnd: allDates[nextEndIndex]
    };
    this.loadData(this.sourceData);
    return true;
  }

  private isPointerOverPlot(event: MouseEvent): boolean {
    const svg = this.svgElement?.nativeElement;
    const matrix = svg?.getScreenCTM();
    const panelsMap = this.chartScaffold.chartMap;
    if (!svg || !matrix || !panelsMap) return false;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const pointer = svgPoint.matrixTransform(matrix.inverse());
    const plotLeft = this.chartScaffold.margins.left;
    const plotRight = this.chartScaffold.width - this.chartScaffold.margins.right;
    if (pointer.x < plotLeft || pointer.x > plotRight) return false;

    return Object.values(panelsMap).some(panel => {
      if (!panel) return false;
      const contentTop = this.chartScaffold.xAxisTop + panel.contentRect.y;
      const contentBottom = contentTop + panel.contentRect.height;
      return pointer.y >= contentTop && pointer.y <= contentBottom;
    });
  }

  private updateCrosshair(event: MouseEvent): void {
    const svg = this.svgElement?.nativeElement;
    const panelsMap = this.chartScaffold.chartMap;
    const matrix = svg?.getScreenCTM();

    if (!svg || !matrix || !panelsMap || !this.dateScaleX) {
      this.hideCrosshair();
      return;
    }

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;

    const pointer = svgPoint.matrixTransform(matrix.inverse());
    const panelEntries = Object.entries(panelsMap).filter(
      (entry): entry is [ChartType, PanelAttributes] => !!entry[1]
    );
    const panels = panelEntries.map(([, panel]) => panel);
    const plotLeft = this.chartScaffold.margins.left;
    const plotRight = this.chartScaffold.width - this.chartScaffold.margins.right;

    const activePanelEntry = panelEntries.find(([, panel]) => {
      const contentTop = this.chartScaffold.xAxisTop + panel.contentRect.y;
      const contentBottom = contentTop + panel.contentRect.height;
      return pointer.y >= contentTop && pointer.y <= contentBottom;
    });
    const activePanel = activePanelEntry?.[1];
    const activeChartType = activePanelEntry?.[0];

    if (
      pointer.x < plotLeft
      || pointer.x > plotRight
      || !activePanel
      || !activeChartType
    ) {
      this.hideCrosshair();
      return;
    }

    const bandwidth = this.dateScaleX.bandwidth();
    let nearestX = pointer.x;
    let nearestDate: Date | undefined;
    let nearestDistance = Number.POSITIVE_INFINITY;

    this.dateScaleX.domain().forEach(date => {
      const bandX = this.dateScaleX(date);
      if (bandX === undefined) return;

      const centerX = plotLeft + bandX + bandwidth / 2;
      const distance = Math.abs(pointer.x - centerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestX = centerX;
        nearestDate = date;
      }
    });

    const readout = nearestDate
      ? this.chartData.getCrosshairReadout(nearestDate)
      : undefined;
    if (!nearestDate || !readout) {
      this.hideCrosshair();
      return;
    }

    const contentBottoms = panels
      .filter(panel => !!panel)
      .map(panel =>
        this.chartScaffold.xAxisTop
        + panel!.contentRect.y
        + panel!.contentRect.height
      );

    this.crosshairX = nearestX;
    this.crosshairY = pointer.y;
    this.crosshairTop = this.chartScaffold.xAxisTop;
    this.crosshairBottom = Math.max(this.crosshairTop, ...contentBottoms);
    this.crosshairLeft = plotLeft;
    this.crosshairRight = plotRight;
    this.activeCrosshairChartType = activeChartType;
    this.activeCrosshairPanel = activePanel;
    this.updateCrosshairCallouts(
      nearestDate,
      pointer.y,
      activeChartType,
      activePanel,
      plotLeft,
      plotRight
    );
    this.crosshairVisible = true;
    this.crosshairService.show(
      { date: nearestDate, value: readout.close },
      readout
    );
  }

  hideCrosshair(): void {
    this.crosshairVisible = false;
    this.activeCrosshairChartType = undefined;
    this.activeCrosshairPanel = undefined;
    this.crosshairService.hide();
  }

  private updateCrosshairCallouts(
    date: Date,
    pointerY: number,
    chartType: ChartType,
    panel: PanelAttributes,
    plotLeft: number,
    plotRight: number
  ): void {
    const dateLabelWidth = 82;
    const valueLabelWidth = 58;
    const contentTop = this.chartScaffold.xAxisTop + panel.contentRect.y;
    const contentBottom = contentTop + panel.contentRect.height;
    const value = this.valueAtPointer(chartType, panel, pointerY - contentTop);

    this.crosshairDateLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    this.crosshairDateLabelX = Math.min(
      Math.max(this.crosshairX - dateLabelWidth / 2, plotLeft),
      plotRight - dateLabelWidth
    );
    this.crosshairDateLabelY = Math.min(
      this.chartScaffold.height - 20,
      this.crosshairBottom + 8
    );

    this.crosshairValueLabel = this.formatAxisValue(chartType, value);
    this.crosshairValueLabelX = Math.min(
      plotRight + 4,
      this.chartScaffold.width - valueLabelWidth - 4
    );
    this.crosshairValueLabelY = Math.min(
      Math.max(pointerY, contentTop + 10),
      contentBottom - 10
    );
  }

  private valueAtPointer(
    chartType: ChartType,
    panel: PanelAttributes,
    localY: number
  ): number {
    const contentHeight = Math.max(1, panel.contentRect.height);
    const clampedY = Math.min(contentHeight, Math.max(0, localY));

    switch (chartType) {
      case ChartType.OHLC: {
        const dataLow = Math.min(...this.stockPriceHistoryData.map(item => item.low));
        const dataHigh = Math.max(...this.stockPriceHistoryData.map(item => item.high));
        const padding = Math.max((dataHigh - dataLow) * 0.04, 1);
        return scaleLinear()
          .domain([dataLow - padding, dataHigh + padding])
          .range([contentHeight, 0])
          .nice()
          .invert(clampedY);
      }
      case ChartType.VOLUME: {
        const maxVolume = Math.max(
          ...this.stockPriceHistoryData.map(item => item.volume ?? 0),
          0
        );
        return scaleLinear()
          .domain([0, maxVolume * 1.06])
          .range([contentHeight, 0])
          .nice()
          .invert(clampedY);
      }
      case ChartType.MACD: {
        const values = this.chartData.macdData.flatMap(item => [
          item.macd,
          item.signal,
          item.histogram
        ]).filter((value): value is number => value !== undefined);
        const minimum = Math.min(0, ...values);
        const maximum = Math.max(0, ...values);
        const padding = (maximum - minimum) * 0.1 || 1;
        const scaleHeight = Math.max(1, panel.panelRect.height);
        const scaledY = clampedY * scaleHeight / contentHeight;
        return scaleLinear()
          .domain([minimum - padding, maximum + padding])
          .range([scaleHeight, 0])
          .nice()
          .invert(scaledY);
      }
      case ChartType.RSI:
        return scaleLinear()
          .domain([0, 100])
          .range([contentHeight, 0])
          .invert(clampedY);
      default:
        return 0;
    }
  }

  private formatAxisValue(chartType: ChartType, value: number): string {
    if (chartType === ChartType.VOLUME) {
      if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
      return value.toFixed(0);
    }

    if (chartType === ChartType.RSI) return value.toFixed(1);
    return value.toFixed(2);
  }

  private updateSvgSize(): void {

    this.svgContainer = this.divSvgContainer.nativeElement;
    this.chartScaffoldRenderer.sizeViewport(
      this.svgContainer,
      this.svgElement.nativeElement,
      this.rSvgElement.nativeElement
    );

    console.log('%c     svgElement ', 'color:#8fb996', this.svgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
    console.log('%c     rSvgElement', 'color:#D9B208', this.rSvgElement, ' x ',
      this.svgElement.nativeElement.clientWidth, this.svgElement.nativeElement.clientHeight);
  }

  private loadData(data: StockPriceHistory[]): void {
    this.sourceData = [...data];
    this.destroyChartComponents();
    this.chartData.load(this.sourceData, this.visibleWindow);
    this.viewportRangeLabel = this.formatViewportRangeLabel(
      this.chartData.stockPriceHistoryData
    );
    if (
      this.maximumViewportDays === undefined
      && this.chartData.stockPriceHistoryData.length > 0
    ) {
      this.maximumViewportDays = this.chartData.stockPriceHistoryData.length;
    }
    this.dataReady = this.chartData.stockPriceHistoryData.length > 0;
    this.hydrated = false;

    if (this.dataReady) {
      this.tryCreateChart();
    }
  }

  private formatViewportRangeLabel(data: StockPriceHistory[]): string {
    if (data.length === 0) return '';

    const formatDate = (date: Date): string => date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${formatDate(data[0].date)} – ${formatDate(data[data.length - 1].date)}`;
  }

  private tryCreateChart(): void {
    console.log('%c     ✔  tryCreateChart', 'color:#90BEE9');
    if (this.viewReady && this.dataReady && !this.hydrated) {
      this.hydrated = true;
      this.changeDetector.detectChanges();
      this.initializeChartWhenReady();
    }
  }

  private initializeChartWhenReady(): void {
    console.log('%c     ✔  initializeChartWhenReady', 'color:#90BEE9');
    if (!this.viewReady || !this.dataReady) {
      console.log('%c     ❌ NOT READY', 'color:red');
      return;
    } else {
      console.log('%c     ✔ READY', 'color:green');
    }

    console.log('%c     ✔ initialize ChartWhenReady', 'color:#90BEE9');

    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.renderChart());
  }

  private queueChartResize(): void {
    if (this.resizeFrame !== undefined) return;

    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = undefined;
      this.resizeChart();
    });
  }

  private resizeChart(): void {
    const width = this.svgContainer.clientWidth;
    const height = this.svgContainer.clientHeight;
    if (
      width <= 0
      || height <= 0
      || (width === this.viewportWidth && height === this.viewportHeight)
    ) {
      return;
    }

    this.viewportWidth = width;
    this.viewportHeight = height;
    this.updateSvgSize();
    if (!this.viewReady || !this.dataReady || !this.hydrated) return;

    this.hideCrosshair();
    this.destroyChartComponents();
    this.renderChart();
  }

  private renderChart(): void {
    this.chartScaffold = this.chartScaffoldBuilder.build(
      this.svgContainer.clientWidth,
      this.svgContainer.clientHeight
    );
    this.chartScaffoldRenderer.renderOuter(
      this.scaffoldElements,
      this.chartScaffold
    );
    this.chartScaffoldRenderer.size(
      this.scaffoldElements,
      this.chartScaffold
    );
    this.dateScaleX = this.chartXAxis.createScale(
      this.chartData.stockPriceHistoryData,
      this.chartScaffold
    );
    this.chartXAxis.renderMonthlyAxes(
      this.gAxisTopMonths.nativeElement,
      this.gAxisBottomMonths.nativeElement,
      this.dateScaleX
    );

    this.applyPanelPreferences(this.panelPreferenceService.getPreferences());

    this.scaffoldSvc.scaffold = this.chartScaffold;
    this.injectConfiguredPanels();
  }

  private injectConfiguredPanels(): void {
    const refs = this.chartPanelRenderer.render({
      containerElement: this.gPanelHostsContainer.nativeElement,
      scaffold: this.chartScaffold,
      preferences: this.panelPreferenceService.getPreferences(),
      calculationData: this.chartData.calculationData,
      data: this.chartData.stockPriceHistoryData,
      dateScaleX: this.dateScaleX
    });

    this.chartComponentRefs.push(...refs);
  }

  private destroyChartComponents(): void {
    while (this.chartComponentRefs.length > 0) {
      const ref = this.chartComponentRefs.pop();
      if (ref) this.panelHost.destroy(ref);
    }
  }

  private applyPanelPreferences(preferences: PanelPreference[]): void {
    if (!this.chartScaffold?.width || !this.chartScaffold?.height) return;

    this.panelWorkspaceLayout.applyPreferences(
      this.chartScaffold,
      preferences
    );

    this.chartScaffoldRenderer.renderOuter(
      this.scaffoldElements,
      this.chartScaffold
    );
    this.chartScaffoldRenderer.size(
      this.scaffoldElements,
      this.chartScaffold
    );
    this.chartScaffoldRenderer.align(
      this.scaffoldElements,
      this.chartScaffold
    );
    this.panelHostRenderer.render(
      this.gPanelHostsContainer.nativeElement,
      this.chartScaffold.chartMap
    );
  }

  private get scaffoldElements() {
    return {
      gAxisTop: this.gAxisTop.nativeElement,
      gAxisTopMonths: this.gAxisTopMonths.nativeElement,
      rAxisTop: this.rAxisTop.nativeElement,
      gPanelHostsContainer: this.gPanelHostsContainer.nativeElement,
      rPanelHostsContainer: this.rPanelHostsContainer.nativeElement,
      gAxisBottom: this.gAxisBottom.nativeElement,
      rAxisBottom: this.rAxisBottom.nativeElement
    };
  }

}
