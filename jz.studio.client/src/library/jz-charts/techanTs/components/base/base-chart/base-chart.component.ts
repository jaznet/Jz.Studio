
/*base-chart.component.ts*/

import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { scaffold } from '../../../interfaces/techan-interfaces';
import { ChartType } from '../../../enums/chart-type';

@Component({
  selector: 'base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export abstract class BaseChartComponent implements AfterViewInit {
  @Input() scaffold!: scaffold;

  protected viewReady = false;
  protected inputsReady = false;

  // Main container
  @ViewChild('gChartContainer', { static: false }) public gChartContainerRef!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer', { static: false }) public rChartContainerRef!: ElementRef<SVGRectElement>;

  // Left Axis
  @ViewChild('gAxisGroupLeft', { static: false }) public gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: false }) public rAxisRectLeftRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft', { static: false }) public gAxisLeftRef!: ElementRef<SVGGElement>;

  // Right Axis
  @ViewChild('gAxisGroupRight', { static: false }) public gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: false }) public rAxisRectRightRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) public gAxisRightRef!: ElementRef<SVGGElement>;

  // Content
  @ViewChild('gContent', { static: false }) public gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) public rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) public gChartRef!: ElementRef<SVGGElement>;

  constructor() {
    console.log('%c⛏️ XTOR Base','color:#F7A072');
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryDrawWhenReady();
  }

  ngOnChanges(): void {
    this.tryDrawWhenReady(); // override calls here
  }

  /**
   * Call this from child when all @Inputs are known and validated.
   */
  protected markInputsReady(): void {
    this.inputsReady = true;
    this.tryDrawWhenReady();
  }

  /**
   * Optional override; called when both inputsReady & viewReady are true.
   */

  chartType!: ChartType;

  public tryDrawWhenReady(): void {
    const section = this.scaffold?.sections?.[this.chartType]; // if you're using dynamic chart type
    const isSized = !!section && section.width > 0 && section.height > 0;

    if (this.viewReady && this.inputsReady && isSized) {
      this.drawChart('tryDrawWhenReady ✅');
    } else {
      console.log('⏳ Waiting to draw:', {
        viewReady: this.viewReady,
        inputsReady: this.inputsReady,
        isSized,
      });
    }
  }

  protected drawChart(caller: string): void {
    // to be implemented by child
  }
}
