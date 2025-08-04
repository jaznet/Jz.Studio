
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ChartType } from '../../../enums/chart-type';
import { ChartScaffold } from '../../../interfaces/chart-scaffold';
import { ChartDataService } from '../../../services/chart-data.service';

@Directive()
// This base class is intended to be extended by chart components
export abstract class BaseChartComponent implements AfterViewInit, OnChanges {

  // === View references ===
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;

  chartType: ChartType = ChartType.Base;
  chartScaffold!: ChartScaffold;

  // === Lifecycle state flags ===
  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;

  constructor(chartData: ChartDataService) { }

  // === Angular lifecycle hooks ===
  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Optionally override this in derived classes to call markInputsReady()
    // when all required inputs like xScale, scaffold, etc. are present
  }

  // === Lifecycle coordinator ===
  protected checkAndDraw(caller: string = 'unknown'): void {
    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady &&
      !!this.gChartRef;   

    console.log(`🧩 [${this.chartType}] checkAndDraw from ${caller}: ready=${ready}`, {
      viewInitialized: this.viewInitialized,
      inputsInitialized: this.inputsInitialized,
      layoutReady: this.layoutReady,
      dataReady: this.dataReady,
      gChartRef: !!this.gChartRef
    })

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.drawChart(caller);
    }
  }

  /**
 * Sets lifecycle flags and attempts to draw.
 * Intended for use immediately after dynamic injection.
 */
  public markReadyAndDraw(options: {
    dataReady?: boolean;
    inputsInitialized?: boolean;
    layoutReady?: boolean;
    caller?: string;
  } = {}): void {
    if (options.dataReady !== undefined) this.dataReady = options.dataReady;
    if (options.inputsInitialized !== undefined) this.inputsInitialized = options.inputsInitialized;
    if (options.layoutReady !== undefined) this.layoutReady = options.layoutReady;

    // Always re-check
    this.checkAndDraw(options.caller || 'markReadyAndDraw');
  }


  // === Markers for derived components to call ===
  protected markInputsReady(): void {
    this.inputsInitialized = true;
    this.checkAndDraw('markInputsReady');
  }

  protected markLayoutReady(): void {
    this.layoutReady = true;
    this.checkAndDraw('markLayoutReady');
  }

  protected markDataReady(): void {
    this.dataReady = true;
    this.checkAndDraw('markDataReady');
  }

  // === Abstract drawing method to be implemented ===
  protected abstract drawChart(caller?: string): void;
}
