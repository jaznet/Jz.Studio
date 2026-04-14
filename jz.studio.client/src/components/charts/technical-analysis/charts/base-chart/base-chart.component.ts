// base-chart.component.ts

import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ScaffoldFramework } from '../../interfaces/scaffold-framework.interface';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { select } from 'd3-selection';

@Component({
  selector: 'base-chart',
  standalone: true,
  templateUrl: './base-chart.component.html',
  styleUrl: './base-chart.component.scss'
})
export abstract class BaseChartComponent implements OnChanges {

  @ViewChild('rSvg', { static: false }) rSvg!: ElementRef<SVGRectElement>;
  @ViewChild('gContent', { static: false }) gContent!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('rAxisGroupLeft', { static: false }) rAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft', { static: false }) gAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisGroupRight', { static: false }) rAxisGroupRight!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) gAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRight', { static: false }) rAxisRight!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;


  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;
  protected chartScaffold!: ScaffoldFramework;
  protected innerHeight = 0;

  chartType: ChartType = ChartType.Base;

  ngOnChanges(changes: SimpleChanges): void {
      throw new Error('Method not implemented.');
  }

  protected getPanel(): PanelAttributes | undefined {
    return this.chartScaffold?.panels?.[this.chartType];
  }

  protected renderPanelChartParts(): void {
    const panel = this.getPanel();
    if (!panel) return;

    const panelRect = panel.panelRect;
    const contentRect = panel.contentRect;
    const axisLeftRect = panel.axisLeftRect;
    const axisRightRect = panel.axisRightRect;

    const panelWidth = Math.max(0, panelRect.width);
    const panelHeight = Math.max(0, panelRect.height);
    const contentWidth = Math.max(0, contentRect.width);
    const contentHeight = Math.max(0, contentRect.height);
    const axisLeftWidth = Math.max(0, axisLeftRect.width);
    const axisLeftHeight = Math.max(0, axisLeftRect.height);
    const axisRightWidth = Math.max(0, axisRightRect.width);
    const axisRightHeight = Math.max(0, axisRightRect.height);

    const contentLocalX = Math.max(0, contentRect.x - panelRect.x);
    const contentLocalY = Math.max(0, contentRect.y - panelRect.y);
    const axisLeftLocalX = Math.max(0, axisLeftRect.x - panelRect.x);
    const axisLeftLocalY = Math.max(0, axisLeftRect.y - panelRect.y);
    const axisRightLocalX = Math.max(0, axisRightRect.x - panelRect.x);
    const axisRightLocalY = Math.max(0, axisRightRect.y - panelRect.y);

    this.innerHeight = contentHeight;

    select(this.rSvg.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    //select(this.rBase.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', panelWidth)
    //  .attr('height', panelHeight);

    select(this.gContent.nativeElement)
      .attr('transform', `translate(${contentLocalX}, ${contentLocalY})`);

    select(this.rContent.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', contentWidth)
      .attr('height', contentHeight);

    select(this.gAxisGroupLeft.nativeElement)
      .attr('transform', `translate(${axisLeftLocalX}, ${axisLeftLocalY})`);

    select(this.rAxisGroupLeft.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', axisLeftWidth)
      .attr('height', axisLeftHeight);

    select(this.gAxisGroupRight.nativeElement)
      .attr('transform', `translate(${axisRightLocalX}, ${axisRightLocalY})`);

    select(this.rAxisGroupRight.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', axisRightWidth)
      .attr('height', axisRightHeight);

    //select(this.gChart.nativeElement)
    //  .attr('transform', `translate(${contentLocalX}, ${contentLocalY})`);

    //select(this.rChart.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', contentWidth)
    //  .attr('height', contentHeight);
  }

  protected abstract createChart(caller: string): void;

  protected checkAndDraw(caller: string = 'unknown'): void {
    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady;

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.renderPanelChartParts();
      this.createChart(caller);
    }
  }

  public markReadyAndDraw(
    opts: {
      dataReady?: boolean;
      inputsInitialized?: boolean;
      caller?: string;
    } = {}
  ): void {
    if (opts.dataReady !== undefined) this.dataReady = opts.dataReady;
    if (opts.inputsInitialized !== undefined) this.inputsInitialized = opts.inputsInitialized;

    this.checkAndDraw(opts.caller ?? 'markReadyAndDraw');
  }

  protected abstract drawYAxes(panel: PanelAttributes, yScale: any): void;

  protected yTickCount(height: number): number {
    return Math.max(2, Math.floor(height / 40));
  }
}
