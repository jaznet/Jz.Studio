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
import type { ScaleBand } from 'd3-scale';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ChartScaffoldBuilderService } from './engine/layout/chart-scaffold-builder.service';
import { PanelWorkspaceLayoutService } from './engine/layout/panel-workspace-layout.service';
import { ChartPanelRendererService } from './engine/rendering/chart-panel-renderer.service';
import { ChartScaffoldRendererService } from './engine/rendering/chart-scaffold-renderer.service';
import { ChartXAxisService } from './engine/rendering/chart-x-axis.service';
import { PanelHostRendererService } from './engine/rendering/panel-host-renderer.service';
import { ChartScaffold } from './interfaces/chart-scaffold.interface';
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
    this.visibleWindow = value;
    this.loadData(this.sourceData);
  }

  @Input()
  set stockPriceHistoryData(value: StockPriceHistory[] | null | undefined) {
    this.loadData(value ?? []);
  }

  get stockPriceHistoryData(): StockPriceHistory[] {
    return this.chartData.stockPriceHistoryData;
  }

  // #endregion @ViewChild List

  // #region Properties
  private readonly destroyed$ = new Subject<void>();
  private readonly chartComponentRefs: ComponentRef<unknown>[] = [];
  private readonly resizeHandler = (): void => this.updateSvgSize();
  private sourceData: StockPriceHistory[] = [];
  private visibleWindow?: TechnicalAnalysisDataWindow;

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
    window.removeEventListener('resize', this.resizeHandler);
    this.destroyChartComponents();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    this.updateSvgSize();
    window.addEventListener('resize', this.resizeHandler);

    this.viewReady = true;
    this.tryCreateChart();

    console.log('%c   🔵 ngAfterViewInit TechnicalAnalysisComponent', 'color:##EDF6F9');
  }

  onChartPointerMove(event: PointerEvent): void {
    if (this.crosshairPinned) return;
    this.updateCrosshair(event);
  }

  onChartClick(event: MouseEvent): void {
    this.crosshairPinned = false;
    this.updateCrosshair(event);
    this.crosshairPinned = this.crosshairVisible;
  }

  onChartPointerLeave(): void {
    if (!this.crosshairPinned) {
      this.hideCrosshair();
    }
  }

  @HostListener('window:keydown.escape')
  releasePinnedCrosshair(): void {
    if (!this.crosshairPinned) return;
    this.crosshairPinned = false;
    this.hideCrosshair();
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
    const panels = Object.values(panelsMap).filter(panel => !!panel);
    const plotLeft = this.chartScaffold.margins.left;
    const plotRight = this.chartScaffold.width - this.chartScaffold.margins.right;

    const activePanel = panels.find(panel => {
      if (!panel) return false;

      const contentTop = this.chartScaffold.xAxisTop + panel.contentRect.y;
      const contentBottom = contentTop + panel.contentRect.height;
      return pointer.y >= contentTop && pointer.y <= contentBottom;
    });

    if (pointer.x < plotLeft || pointer.x > plotRight || !activePanel) {
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
    this.crosshairVisible = true;
    this.crosshairService.show(
      { date: nearestDate, value: readout.close },
      readout
    );
  }

  hideCrosshair(): void {
    this.crosshairVisible = false;
    this.crosshairService.hide();
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
    this.dataReady = this.chartData.stockPriceHistoryData.length > 0;
    this.hydrated = false;

    if (this.dataReady) {
      this.tryCreateChart();
    }
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

    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
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
    });
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
