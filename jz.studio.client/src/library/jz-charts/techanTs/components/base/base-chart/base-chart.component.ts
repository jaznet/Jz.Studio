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
import type { Selection as D3Selection } from 'd3-selection';

import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';
import { ChartScaffoldService } from '../../../services/chart-scaffold.service';

@Directive()
export abstract class BaseChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;

  chartType: ChartType = ChartType.Base;

  protected chartScaffold!: ChartScaffold;

  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;

  private destroyed$ = new Subject<void>();

  // --- background rect options (can be overridden in subclass) ---
  protected enableBackgroundRect = true;
  protected backgroundRectId?: string; // defaults to `${chartTypeName()}-bg`
  protected backgroundRectClass = 'chart-bg';
  protected backgroundRectPosition: 'behind' | 'front' = 'behind';
  protected backgroundRectAttrs?: Record<string, string | number | null | undefined>;

  /** Keep a handle to the bg <rect>. */
  protected bgRectSel?: D3Selection<SVGRectElement, any, SVGGElement, any>;

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService,
    protected hostEl: ElementRef<SVGGElement> // host <g>
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

  ngOnChanges(_: SimpleChanges): void { }

  public markReadyAndDraw(opts: {
    dataReady?: boolean;
    inputsInitialized?: boolean;
    caller?: string;
  } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
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

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;

      if (this.enableBackgroundRect) {
        const id = this.backgroundRectId ?? `${this.chartTypeName()}-bg`;
        this.ensureInnerRect(id, {
          position: this.backgroundRectPosition,
          className: this.backgroundRectClass,
          attrs: this.backgroundRectAttrs,
        });
      }

      this.sizeChartElements();
      this.createChart(caller);
    }
  }

  /** Typed host selection (parent element = SVGGElement). */
  private hostSel(): D3Selection<SVGGElement, any, null, undefined> {
    return select<SVGGElement, any>(this.hostEl.nativeElement as SVGGElement);
  }

  /**
   * Create/reuse a <rect> INSIDE the host <g>, ordered relative to #gChartContainer.
   */
  protected ensureInnerRect(
    id: string,
    opts: {
      position?: 'behind' | 'front';
      className?: string;
      attrs?: Record<string, string | number | null | undefined>;
    } = {}
  ): SVGRectElement {
    const host = this.hostEl.nativeElement as SVGGElement;
    const hostSel = this.hostSel();

    const sel: D3Selection<SVGRectElement, any, SVGGElement, any> = hostSel
      .selectAll<SVGRectElement, any>(`rect#${id}`)
      .data([1])
      .join('rect')
      .attr('id', id);

    if (opts.className) sel.attr('class', opts.className);
    if (opts.attrs) {
      for (const [k, v] of Object.entries(opts.attrs)) {
        if (v != null) sel.attr(k, v as any);
      }
    }

    const anchor = host.querySelector<SVGGElement>(':scope > #gChartContainer');
    if ((opts.position ?? 'behind') === 'front') {
      sel.raise();
    } else if (anchor) {
      host.insertBefore(sel.node()!, anchor); // behind content
    } else {
      sel.lower();
    }

    this.bgRectSel = sel;
    return sel.node()!;
  }

  /**
   * Size chart-local elements. Here we size the background rect to the panel's
   * content box (inside margins). Call again on resize if needed.
   */
  protected sizeChartElements(): void {
    const panel = this.chartScaffold?.panels?.[this.chartType];
    if (!panel) return;

    const m = panel.margins ?? { top: 0, right: 0, bottom: 0, left: 0 };
    const x = m.left, y = m.top;
    const width = (panel.width ?? 0) - m.left - m.right;
    const height = (panel.height ?? 0) - m.top - m.bottom;

    const bgId = this.backgroundRectId ?? `${this.chartTypeName()}-bg`;
    const hostSel = this.hostSel(); // typed Selection<SVGGElement, any, null, undefined>

    if (!this.bgRectSel || this.bgRectSel.empty()) {
      // ✅ parent of this selection is SVGGElement (matches bgRectSel’s type)
      const selected: D3Selection<SVGRectElement, any, SVGGElement, any> =
        hostSel.selectAll<SVGRectElement, any>(`rect#${bgId}`);

      if (!selected.empty()) {
        this.bgRectSel = selected;
      } else {
        // delegate creation to the canonical method (keeps attrs/class/z-ordering)
        this.ensureInnerRect(bgId, {
          position: this.backgroundRectPosition,
          className: this.backgroundRectClass,
          attrs: this.backgroundRectAttrs,
        });
      }
    }

    this.bgRectSel
      ?.attr('x', x)
      ?.attr('y', y)
      ?.attr('width', Math.max(0, width))
      ?.attr('height', Math.max(0, height));
  }


  /** Implement in subclasses to perform actual drawing. */
  protected abstract createChart(caller: string): void;

  private chartTypeName(): string {
    const n = (ChartType as any)[this.chartType];
    return typeof n === 'string' ? n : String(this.chartType);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
