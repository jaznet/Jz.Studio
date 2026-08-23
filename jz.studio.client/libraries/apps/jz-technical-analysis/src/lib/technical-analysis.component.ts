/* technical-analysis.component.ts */

// #region imports
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import type { ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ChartScaffoldBuilderService } from './engine/layout/chart-scaffold-builder.service';
import { PanelDefinitionBuilderService } from './engine/layout/panel-definition-builder.service';
import { PanelLayoutService } from './engine/layout/panel-layout.service';
import { ChartPanelRendererService } from './engine/rendering/chart-panel-renderer.service';
import { ChartScaffoldRendererService } from './engine/rendering/chart-scaffold-renderer.service';
import { ChartXAxisService } from './engine/rendering/chart-x-axis.service';
import { PanelHostRendererService } from './engine/rendering/panel-host-renderer.service';
import { ChartLayoutRequest } from './interfaces/chart-layout-request.interface';
import { ChartScaffold } from './interfaces/chart-scaffold.interface';
import { DivRect } from './interfaces/common-interfaces';
import type {
  PanelViewModel
} from './interfaces/panel-interfaces';
import { PanelPreference } from './interfaces/panel-preference.interface';
import { StockPriceHistory } from './models/stock-price-history.model';
import { ChartDataService } from './services/chart-data.service';
import { ChartScaffoldService } from './services/chart-scaffold.service';
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

  @ViewChild('gChartTitle', { static: false }) gChartTitle!: ElementRef<SVGGElement>;
  @ViewChild('rChartTitle', { static: false }) rChartTitle!: ElementRef<SVGRectElement>;
  @ViewChild('tChartTitleText', { static: false }) tChartTitleText!: ElementRef<SVGTextElement>;

  @ViewChild('gAxisTop', { static: false }) gAxisTop!: ElementRef<SVGGElement>;
  @ViewChild('rAxisTop', { static: false }) rAxisTop!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisTopMonths', { static: false }) gAxisTopMonths!: ElementRef<SVGGElement>;

  @ViewChild('gAxisBottom', { static: false }) gAxisBottom!: ElementRef<SVGGElement>;
  @ViewChild('rAxisBottom', { static: false }) rAxisBottom!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisBottomMonths', { static: false }) gAxisBottomMonths!: ElementRef<SVGGElement>;
  //@ViewChild('gAxisBottom', { static: false }) gAxisBottom!: ElementRef<SVGGElement>;
  /*  @ViewChild('xAxisGroupBottom', { static: false }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;*/

  @ViewChild('gPanelHostsContainer', { static: false }) gPanelHostsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rPanelHostsContainer', { static: false }) rPanelHostsContainer!: ElementRef<SVGRectElement>;

  @Input() chartTitle: any = 'Technical Analysis Chart';

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

  chartScaffold: ChartScaffold = {
    titleWidth: 0,
    titleHeight: 0,
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
  panelViewModels: PanelViewModel[] = [];

  dataReady = false;
  viewReady = false;
  hydrated = false;

  dateScaleX!: ScaleBand<Date>;
  svgContainer!: HTMLDivElement;

  // #endregion Properties

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    public chartData: ChartDataService,
    public layoutService: PanelLayoutService,
    private chartScaffoldBuilder: ChartScaffoldBuilderService,
    private panelDefinitionBuilder: PanelDefinitionBuilderService,
    private panelHost: PanelHostService,
    private chartPanelRenderer: ChartPanelRendererService,
    private chartScaffoldRenderer: ChartScaffoldRendererService,
    private chartXAxis: ChartXAxisService,
    private panelHostRenderer: PanelHostRendererService,
    private scaffoldSvc: ChartScaffoldService,
    private panelPreferenceService: PanelPreferenceService
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

  private loadData(data: StockPriceHistory[]): void {
    this.destroyChartComponents();
    this.chartData.load(data);
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
      this.chartScaffold = this.chartScaffoldBuilder.build(
        this.svgContainer.clientWidth,
        this.svgContainer.clientHeight
      );
      this.chartScaffoldRenderer.renderOuter(
        this.scaffoldElements,
        this.chartScaffold,
        this.chartTitle
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

    const panelDefinitions = this.panelDefinitionBuilder.build(preferences);

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

    this.chartScaffoldRenderer.renderOuter(
      this.scaffoldElements,
      this.chartScaffold,
      this.chartTitle
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
      rChartTitle: this.rChartTitle.nativeElement,
      tChartTitleText: this.tChartTitleText.nativeElement,
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
