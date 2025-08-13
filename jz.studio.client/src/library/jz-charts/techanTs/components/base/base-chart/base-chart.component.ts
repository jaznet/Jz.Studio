// base-chart.component.ts
import {
  AfterViewInit, Directive, ElementRef, OnDestroy, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { select } from 'd3-selection';

import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';
import { ChartScaffoldService } from '../../../services/chart-scaffold.service';

@Directive()
export abstract class BaseChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;

  // child should override this
  chartType: ChartType = ChartType.Base;

  protected chartScaffold!: ChartScaffold;
  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;

  // auto-bg-rect settings (override in child if you like)
  protected enableBackgroundRect = true;
  protected backgroundRectId?: string; // default computed from chartType, e.g. "OHLC-bg"
  protected backgroundRectClass = 'chart-bg';
  protected backgroundRectPosition: 'behind' | 'front' = 'behind';
  protected backgroundRectAttrs?: Record<string, string | number | null | undefined>;

  private destroyed$ = new Subject<void>();

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService,
    /** Host <g> for this component (e.g., <g id="OHLC">) */
    protected hostEl: ElementRef<SVGGElement>
  ) {
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
    // children call markReadyAndDraw({ inputsInitialized: true, ... })
  }

  protected checkAndDraw(caller: string = 'unknown'): void {
    if (this.chartScaffold) {
      this.layoutReady = !!this.chartScaffold.panels?.[this.chartType];
    }

    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady &&
      !!this.gChartRef;

    console.log(
      `%c[checkAndDraw] ready=${ready} ` +
      `%cviewInit=${this.viewInitialized} ` +
      `%cinputsInit=${this.inputsInitialized} ` +
      `%clayoutReady=${this.layoutReady} ` +
      `%cdataReady=${this.dataReady} ` +
      `%cgChartRef=${!!this.gChartRef}`,
      'color:#4062BB;font-weight:bold;',
      `color:${this.viewInitialized ? 'green' : 'red'};`,
      `color:${this.inputsInitialized ? 'green' : 'red'};`,
      `color:${this.layoutReady ? 'green' : 'red'};`,
      `color:${this.dataReady ? 'green' : 'red'};`,
      `color:${this.gChartRef ? 'green' : 'red'};`
    );

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;

      // 🔹 ensure background rect once, before first draw
      if (this.enableBackgroundRect) {
        const id = this.backgroundRectId ?? `${this.chartTypeName()}-bg`;
        this.ensureInnerRect(id, {
          position: this.backgroundRectPosition,
          className: this.backgroundRectClass,
          attrs: this.backgroundRectAttrs
        });
      }

      this.sizeChartElements();
      this.createChart(caller);
    }
  }

  private sizeChartElements() {
    console.log(this.scaffoldSvc.scaffold?.yAxisLeft);
  }

  protected abstract createChart(caller: string): void;

  /** Let subclasses flip flags and re-check */
  public markReadyAndDraw(opts: {
    dataReady?: boolean; inputsInitialized?: boolean; caller?: string;
  } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }

  /** Create/reuse <rect> INSIDE the host <g>, as a sibling of #gChartContainer. */
  protected ensureInnerRect(
    id: string,
    opts?: {
      position?: 'behind' | 'front'; className?: string;
      attrs?: Record<string, string | number | null | undefined>;
    }
  ): SVGRectElement {
    const host = this.hostEl.nativeElement; // <g id="OHLC">
    const sel = select(host)
      .selectAll<SVGRectElement, unknown>(`rect#${id}`)
      .data([null])
      .join('rect')
      .attr('id', id);

    if (opts?.className) sel.attr('class', opts.className);
    if (opts?.attrs) for (const [k, v] of Object.entries(opts.attrs)) {
      if (v != null) sel.attr(k, v as any);
    }

    // order relative to #gChartContainer
    const anchor = host.querySelector<SVGGElement>(':scope > #gChartContainer');
    if ((opts?.position ?? 'behind') === 'front') {
      sel.raise();
    } else if (anchor) {
      host.insertBefore(sel.node()!, anchor); // behind chart content
    } else {
      sel.lower();
    }
    return sel.node()!;
  }

  /** Helpful for default bg id */
  private chartTypeName(): string {
    const n = (ChartType as any)[this.chartType];
    return typeof n === 'string' ? n : String(this.chartType);
  }



  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
