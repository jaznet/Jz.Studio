// base-chart.component.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { select } from 'd3-selection';

import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';
import { ChartScaffoldService } from '../../../services/chart-scaffold.service';

@Directive()
export abstract class BaseChartComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  // Core drawing group for the chart’s internals
  @ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;
  @ViewChild('rChart', { static: false }) rChart!: ElementRef<SVGRectElement>;
  @ViewChild('gContent', { static: false }) gContent!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('gChartContainer', { static: false }) gChartContainer!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer', { static: false }) rChartContainer!: ElementRef<SVGRectElement>;
  @ViewChild('gBase', { static: false }) gBase!: ElementRef<SVGGElement>;
  @ViewChild('rBase', { static: false }) rBase!: ElementRef<SVGRectElement>;

  @Input()                           // <— allow direct input
  set scaffold(value: ChartScaffold | undefined) {
    if (!value) return;
    this.chartScaffold = value;
    this.layoutReady = !!this.chartScaffold?.panels?.[this.chartType];
    this.drawAttempted = false;      // allow a fresh attempt after layout changes
    this.checkAndDraw('scaffold@Input');
  }

  // Identify the chart kind; override in derived classes
  chartType: ChartType = ChartType.Base;

  // Shared layout model from TechanTs via service
  protected chartScaffold!: ChartScaffold;

  // Lifecycle flags coordinated by the base
  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;

  private destroyed$ = new Subject<void>();

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService
  ) {
    this.scaffoldSvc.scaffold$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scaffold => {
        if (!scaffold) return;
        this.chartScaffold = scaffold;
        this.layoutReady = !!this.chartScaffold?.panels?.[this.chartType];
        this.drawAttempted = false;
        this.checkAndDraw('scaffold$');
      });
  }

  // ========== Angular lifecycle ==========

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(_: SimpleChanges): void {
    // If derived charts set inputs via @Input (e.g., data, scales),
    // they can call this.markInputsReady() or markReadyAndDraw() themselves.
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // ========== Coordinator ==========

  protected checkAndDraw(caller: string = 'unknown'): void {
    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady;

    // One-line colorized log
    console.log(
      `%c   [checkAndDraw] ready=${ready} ` +
      `%cviewInit=${this.viewInitialized} ` +
      `%cinputsInit=${this.inputsInitialized} ` +
      `%clayoutReady=${this.layoutReady} ` +
      `%cdataReady=${this.dataReady} ` +
      `%cgChartRef=${!!this.gChart}`,
      'color:#4062BB;font-weight:bold;',
      `color:${this.viewInitialized ? 'green' : '#BA1200'};`,
      `color:${this.inputsInitialized ? 'green' : 'red'};`,
      `color:${this.layoutReady ? 'green' : 'red'};`,
      `color:${this.dataReady ? 'green' : 'red'};`,
      `color:${!!this.gChart ? 'green' : 'red'};`
    );

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.sizeChartParts();
      this.createChart(caller); // implemented by derived chart
    }
  }

  protected sizeChartParts() {
    const panel = this.chartScaffold?.panels?.[this.chartType];
    if (!panel) return;

    const width = Math.max(0, panel.width ?? 0);
    const height = Math.max(0, panel.height ?? 0);

    // Base fills the whole panel
    select(this.rBase.nativeElement)
      .attr('x', 0).attr('y', 0)
      .attr('width', width).attr('height', height);

    // Content origin stays at (0,0) — no margin translate
    select(this.gChartContainer.nativeElement)
      .attr('transform', `translate(0,0)`);

    // Inner content boxes = full panel size
    select(this.rChartContainer.nativeElement)
      .attr('x', 0).attr('y', 0)
      .attr('width', width).attr('height', height);

    select(this.rContent.nativeElement)
      .attr('x', 0).attr('y', 0)
      .attr('width', width).attr('height', height);

    select(this.rChart.nativeElement)
      .attr('x', 0).attr('y', 0)
      .attr('width', width).attr('height', height);
  }


  /**
   * Convenience for dynamic injection sites to flip flags and attempt draw.
   * Example usage right after you assign inputs like data/xScale.
   */
  public markReadyAndDraw(opts: {
    dataReady?: boolean;
    inputsInitialized?: boolean;
    caller?: string;
  } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined)
      this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }

  /** For derived charts to call once their required @Input()s are set */
  protected markInputsReady(): void {
    this.inputsInitialized = true;
    this.checkAndDraw('markInputsReady');
  }

  /** Subclasses must implement their drawing here */
  protected abstract createChart(caller: string): void;
}
