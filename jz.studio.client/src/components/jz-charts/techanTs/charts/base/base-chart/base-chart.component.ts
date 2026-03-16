// base-chart.component.ts
import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { select } from 'd3-selection';

import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';
import { ChartScaffoldService } from '../../../services/chart-scaffold.service';

@Component({
    selector: 'g[base-chart]', // 👈 host is a <g>
    templateUrl: './base-chart.component.html',
    styleUrls: ['./base-chart.component.scss'],
    standalone: false
})
export abstract class BaseChartComponent  implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('rSvg', { static: false }) rSvg!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rAxisGroupLeft', { static: false }) rAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisGroupRight', { static: false }) rAxisGroupRight!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft', { static: false }) gAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) gAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRight', { static: false }) rAxisRight!: ElementRef<SVGRectElement>;

  @ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;
  @ViewChild('rChart', { static: false }) rChart!: ElementRef<SVGRectElement>;
  @ViewChild('gContent', { static: false }) gContent!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('gChartContainer', { static: false }) gChartContainer!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer', { static: false }) rChartContainer!: ElementRef<SVGRectElement>;
  @ViewChild('rBase', { static: false }) rBase!: ElementRef<SVGRectElement>;

  @Input()
  set scaffold(value: ChartScaffold | undefined) {
    if (!value) return;
    this.chartScaffold = value;
    this.layoutReady = !!this.chartScaffold?.panels?.[this.chartType];
    this.drawAttempted = false;
    this.checkAndDraw('scaffold@Input');
  }

  chartType: ChartType = ChartType.Base;

  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;
  private destroyed$ = new Subject<void>();

  protected chartScaffold!: ChartScaffold;
  protected innerHeight: number = 0;
  protected L = 0; protected R = 0; protected T = 4; protected B = 0;

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

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }
  ngOnChanges(_: SimpleChanges): void { }
  ngOnDestroy(): void { this.destroyed$.next(); this.destroyed$.complete(); }

  protected checkAndDraw(caller: string = 'unknown'): void {
    const ready = this.viewInitialized && this.inputsInitialized && this.layoutReady && this.dataReady;
    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.sizeAndPositionChartParts();
      this.createChart(caller);
    }
  }

  protected sizeAndPositionChartParts() {
    const panel = this.chartScaffold?.panels?.[this.chartType];
    if (!panel) return;

    const width =  Math.max(0, panel.width ?? 0);
    const height = Math.max(0, panel.height ?? 0);
    const chartWidth = Math.max(
      0,
      (panel?.width ?? 0)
      - (this.chartScaffold.panels?.[this.chartType]?.margins?.left ?? 0)
      - (this.chartScaffold.panels?.[this.chartType]?.margins?.right ?? 0)
    );

    this.innerHeight = height - this.L;
     
    select(this.rSvg.nativeElement).attr('x', 0).attr('y', 0).attr('width', width).attr('height', height).classed('rSvg', true);
    select(this.rAxisGroupLeft.nativeElement).attr('x', 0).attr('y', 0).attr('width', this.chartScaffold.yAxisLeft).attr('height', height).classed('group', true);
    select(this.gAxisLeft.nativeElement).attr('transform', `translate(${this.chartScaffold.yAxisLeft},0)`);
    select(this.gAxisRight.nativeElement).attr('transform', `translate(${-this.chartScaffold.yAxisRight},0)`);   
    select(this.rBase.nativeElement).attr('x', 0).attr('y', 0).attr('width', width).attr('height', height);
    select(this.gChartContainer.nativeElement).attr('transform', `translate(0,${this.L})`);              // no margins stet
    select(this.rChartContainer.nativeElement).attr('x', 0).attr('y', 0).attr('width', width).attr('height', height);
    select(this.gContent.nativeElement).attr('transform', `translate(30,0)`);      
    select(this.rContent.nativeElement).attr('x', 0).attr('y', 0).attr('width', chartWidth).attr('height', height);
    select(this.rChart.nativeElement).attr('x', 0).attr('y', 0).attr('width', chartWidth).attr('height', this.innerHeight).classed('rChart', true);
    select(this.gAxisGroupRight.nativeElement).attr('transform', `translate(${panel.width},0)`);     
  }

  public markReadyAndDraw(opts: { dataReady?: boolean; inputsInitialized?: boolean; caller?: string } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }
  protected markInputsReady(): void { this.inputsInitialized = true; this.checkAndDraw('markInputsReady'); }
  protected abstract createChart(caller: string): void;
  /** Force children to define their own axis policy */
  protected abstract drawYAxes(panel: { width: number; height: number }, yScale: any): void;

  /** Optional micro-helpers children can reuse (not required) */
  protected yTickCount(h: number): number { return Math.max(2, Math.floor(h / 40)); }
}
