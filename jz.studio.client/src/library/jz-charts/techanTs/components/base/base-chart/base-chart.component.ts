
// base-chart.component.ts
import { AfterViewInit, Directive, ElementRef, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';
import { ChartScaffoldService } from '../../../services/chart-scaffold.service';
import { select } from 'd3-selection';

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

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService
  ) {
    // Subscribe immediately so we catch updates even if set before injection
    this.scaffoldSvc.scaffold$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scaffold => {
        if (!scaffold) return;
        this.chartScaffold = scaffold;
        // mark layout ready only if our panel exists
        this.layoutReady = !!this.chartScaffold?.panels?.[this.chartType];
        this.checkAndDraw('scaffold$');
      });
  }


  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(_: SimpleChanges): void {
    // if you set data/xScale through @Input, flip flags here and re-check
  }

  protected checkAndDraw(caller: string = 'unknown'): void {
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

      'color: #4062BB; font-weight: bold;',
      `color: ${this.viewInitialized ? 'green' : '#BA1200'};`,
      `color: ${this.inputsInitialized ? 'green' : 'red'};`,
      `color: ${this.layoutReady ? 'green' : 'red'};`,
      `color: ${this.dataReady ? 'green' : 'red'};`,
      `color: ${!!this.gChartRef ? 'green' : 'red'};`
    );

    // console.debug(...) if you want logs

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.createChart(caller);
    }
  }

  public markReadyAndDraw(opts: {
    dataReady?: boolean;
    inputsInitialized?: boolean;
    caller?: string;
  } = {}): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;
    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }

  protected  sizeChartElements(): void {

    select(this.rAxisLeft.nativeElement).attr('width', 100).attr('height', 100).attr('stroke','gold');
    console.log(this.rAxisLeft);
  }

  protected abstract createChart(caller: string): void;



  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
