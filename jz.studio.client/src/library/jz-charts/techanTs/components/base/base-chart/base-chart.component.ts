// base-chart.component.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
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
export abstract class BaseChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;
  @ViewChild('rChart', { static: false }) rChart!: ElementRef<SVGGElement>;
  
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('rChartContainer', { static: false }) rChartContainer!: ElementRef<SVGRectElement>;
  @ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('rContent', { static: false }) rBase!: ElementRef<SVGRectElement>;

  /** Subclasses should set this (e.g., ChartType.OHLC). */
  chartType: ChartType = ChartType.Base;

  protected chartScaffold!: ChartScaffold;

  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;

  private destroyed$ = new Subject<void>();

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService,
    /** Host <g> for this chart (e.g., <g id="...-OHLC">) provided by the parent injector. */
    protected hostEl: ElementRef<SVGGElement>
  ) {
    // React to scaffold changes (dimensions/margins), then try drawing.
    this.scaffoldSvc.scaffold$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scaffold => {
        if (!scaffold) return;
        this.chartScaffold = scaffold;
        this.layoutReady = !!this.chartScaffold?.panels?.[this.chartType];
        this.checkAndDraw('scaffold$');
      });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(_: SimpleChanges): void {
    // Subclasses typically call markReadyAndDraw({ inputsInitialized: true }) from their own ngOnChanges
  }

  /** Flip readiness flags and re-check draw gate. */
  public markReadyAndDraw(opts: {
    dataReady?: boolean;
    inputsInitialized?: boolean;
    caller?: string;
  } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }

  /** Central readiness gate; draws once when all prerequisites are true. */
  protected checkAndDraw(caller: string = 'unknown'): void {
    if (this.chartScaffold) {
      this.layoutReady = !!this.chartScaffold.panels?.[this.chartType];
    }

    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady &&
      !!this.gChart;

    // pretty one-line debug (green for true, red for false)
    {
      const L = 'color:#A3C4BC';
      const G = 'color:#22c55e;font-weight:700';
      const R = 'color:#ef4444;font-weight:700';
      const b = (v: boolean) => (v ? G : R);
      // eslint-disable-next-line no-console
      console.log(
        `%ccheckAndDraw | %cready:%c${ready} %cviewInit:%c${this.viewInitialized} %cinputsInit:%c${this.inputsInitialized} %clayoutReady:%c${this.layoutReady} %cdataReady:%c${this.dataReady} `,
        L,
        L, b(ready),
        L, b(this.viewInitialized),
        L, b(this.inputsInitialized),
        L, b(this.layoutReady),
        L, b(this.dataReady),
        L, b(!!this.gChart),
      );
    }

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;

      // 1) Size the placeholder + content rects to current panel dims
      this.sizeChartElements();

      // 2) Let subclass render chart graphics
      this.createChart(caller);
    }
  }

  /**
   * Size chart-local elements.
   * - rChartContainer: full panel (no margins) → acts as simple placeholder
   * - rContent: inner content box (inside margins) for actual drawing area
   */
  protected sizeChartElements(): void {
    const panel = this.chartScaffold?.panels?.[this.chartType];
    if (!panel) return;

    // Full panel box (placeholder)
    const pW = panel.width ?? 0;
    const pH = panel.height ?? 0;

    // Content box (inside margins)
    const m = panel.margins ?? { top: 0, right: 0, bottom: 0, left: 0 };
    const cW = Math.max(0, pW - m.left - m.right);
    const cH = Math.max(0, pH - m.top - m.bottom);

    // Placeholder: no margins
    select(this.rChartContainer.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', pW)
      .attr('height', pH)
      .attr('class', 'chart-container'); // style in CSS as you like

    select(this.rChart.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', cW)
      .attr('height', cH)
      .attr('fill','red')
      .attr('transform', `translate(${m.left},${m.top})`);

    // Content rect: translated into margin box
    select(this.rContent.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', cW)
      .attr('height', cH)
      .attr('fill', 'blue')
      .attr('transform', `translate(${m.left},${m.top})`);

    // (Optional) axis-left debug rect equals left margin area
    if (this.rAxisLeft) {
      select(this.rAxisLeft.nativeElement)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', m.left)
        .attr('height', pH);
    }
  }

  /** Subclasses implement the actual chart drawing into #gChart. */
  protected abstract createChart(caller: string): void;

  protected chartTypeName(): string {
    const n = (ChartType as any)[this.chartType];
    return typeof n === 'string' ? n : String(this.chartType);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
