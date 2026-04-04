// scaffold.component.ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { select } from 'd3-selection';

import { ChartType } from '../../enums/chart-type';
import { Scaffold } from '../../interfaces/scaffold.interface';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';

@Component({
  selector: 'g[base-chart]',
  templateUrl: '../base/scaffold.component.html',
  styleUrls: ['../base/scaffold.component.scss'],
  standalone: true
})
export abstract class ScaffoldComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('rSvg', { static: false }) rSvg!: ElementRef<SVGRectElement>;

  //@ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeft!: ElementRef<SVGGElement>;
  //@ViewChild('rAxisGroupLeft', { static: false }) rAxisGroupLeft!: ElementRef<SVGRectElement>;
  //@ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRight!: ElementRef<SVGGElement>;
  //@ViewChild('rAxisGroupRight', { static: false }) rAxisGroupRight!: ElementRef<SVGRectElement>;
  //@ViewChild('gAxisLeft', { static: false }) gAxisLeft!: ElementRef<SVGGElement>;
  //@ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;
  //@ViewChild('gAxisRight', { static: false }) gAxisRight!: ElementRef<SVGGElement>;
  //@ViewChild('rAxisRight', { static: false }) rAxisRight!: ElementRef<SVGRectElement>;

  //@ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;
  //@ViewChild('rChart', { static: false }) rChart!: ElementRef<SVGRectElement>;
  //@ViewChild('gPanelsContainer', { static: false }) gPanelsContainer!: ElementRef<SVGGElement>;
  //@ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('gPanelsContainer', { static: false }) gPanelsContainer!: ElementRef<SVGGElement>;
  @ViewChild('rPanelsContainer', { static: false }) rPanelsContainer!: ElementRef<SVGRectElement>;
  @ViewChild('rBase', { static: false }) rBase!: ElementRef<SVGRectElement>;

  @Input()
  set scaffold(value: Scaffold | undefined) {
    if (!value) return;

    this.chartScaffold = value;
    this.layoutReady = !!this.getPanel();
    this.drawAttempted = false;
    this.checkAndDraw('scaffold@Input');
  }

  chartType: ChartType = ChartType.Base;

  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;
  protected chartScaffold!: Scaffold;
  protected innerHeight = 0;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    protected chartData: ChartDataService,
    protected scaffoldSvc: ChartScaffoldService
  ) {
    //this.scaffoldSvc.scaffold$
    //  .pipe(takeUntil(this.destroyed$))
    //  .subscribe(scaffold => {
    //    if (!scaffold) return;

    //    this.chartScaffold = scaffold;
    //    this.layoutReady = !!this.getPanel();
    //    this.drawAttempted = false;
    //    this.checkAndDraw('scaffold$');
    //  });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(_: SimpleChanges): void {
    // Reserved for future derived-chart input coordination.
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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

    select(this.rBase.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    //select(this.gContent.nativeElement)
    //  .attr('transform', `translate(${contentLocalX}, ${contentLocalY})`);

    //select(this.rContent.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', contentWidth)
    //  .attr('height', contentHeight);

    //select(this.gAxisGroupLeft.nativeElement)
    //  .attr('transform', `translate(${axisLeftLocalX}, ${axisLeftLocalY})`);

    //select(this.rAxisGroupLeft.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', axisLeftWidth)
    //  .attr('height', axisLeftHeight);

    //select(this.gAxisGroupRight.nativeElement)
    //  .attr('transform', `translate(${axisRightLocalX}, ${axisRightLocalY})`);

    //select(this.rAxisGroupRight.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', axisRightWidth)
    //  .attr('height', axisRightHeight);

    //select(this.gChart.nativeElement)
    //  .attr('transform', `translate(${contentLocalX}, ${contentLocalY})`);

    //select(this.rChart.nativeElement)
    //  .attr('x', 0)
    //  .attr('y', 0)
    //  .attr('width', contentWidth)
    //  .attr('height', contentHeight);
  }

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

  protected sizeAndPositionChartParts(): void {
    const panel = this.getPanel();
    if (!panel) return;

    const panelRect = panel.panelRect;
    const contentRect = panel.contentRect;
    const axisLeftRect = panel.axisLeftRect;
    const axisRightRect = panel.axisRightRect;

    const panelWidth = Math.max(0, panelRect?.width ?? 0);
    const panelHeight = Math.max(0, panelRect?.height ?? 0);
    const contentWidth = Math.max(0, contentRect?.width ?? 0);
    const contentHeight = Math.max(0, contentRect?.height ?? 0);
    const axisLeftWidth = Math.max(0, axisLeftRect?.width ?? 0);
    const axisLeftHeight = Math.max(0, axisLeftRect?.height ?? 0);
    const axisRightWidth = Math.max(0, axisRightRect?.width ?? 0);
    const axisRightHeight = Math.max(0, axisRightRect?.height ?? 0);

    // Local offsets inside this panel's root group.
    const contentLocalX = Math.max(0, (contentRect?.x ?? 0) - (panelRect?.x ?? 0));
    const contentLocalY = Math.max(0, (contentRect?.y ?? 0) - (panelRect?.y ?? 0));
    const axisLeftLocalX = Math.max(0, (axisLeftRect?.x ?? 0) - (panelRect?.x ?? 0));
    const axisLeftLocalY = Math.max(0, (axisLeftRect?.y ?? 0) - (panelRect?.y ?? 0));
    const axisRightLocalX = Math.max(0, (axisRightRect?.x ?? 0) - (panelRect?.x ?? 0));
    const axisRightLocalY = Math.max(0, (axisRightRect?.y ?? 0) - (panelRect?.y ?? 0));

    this.innerHeight = contentHeight;

    // Root panel-sized rect.
    select(this.rSvg.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panelWidth)
      .attr('height', panelHeight)
      .classed('rSvg', true);

    select(this.rBase.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    // This component is hosted as <g[base-chart]> inside the correct panel slot,
    // so the chart container itself should be local to the panel.
    select(this.gPanelsContainer.nativeElement)
      .attr('transform', 'translate(0,60)');

    const pc = this.chartScaffold?.panelsContainer;
    if (!pc) return;


    select(this.rPanelsContainer.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', pc.width)
      .attr('height', pc.height);

    
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

  //protected markInputsReady(): void {
  //  this.inputsInitialized = true;
  //  this.checkAndDraw('markInputsReady');
  //}

  protected getPanel(): PanelAttributes | undefined {
    return this.chartScaffold?.panels?.[this.chartType];
  }

  protected abstract createChart(caller: string): void;

  protected abstract drawYAxes(panel: PanelAttributes, yScale: any): void;

  protected yTickCount(height: number): number {
    return Math.max(2, Math.floor(height / 40));
  }
}
