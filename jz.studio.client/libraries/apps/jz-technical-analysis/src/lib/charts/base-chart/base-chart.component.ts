// base-chart.component.ts

import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { select } from 'd3-selection';
import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { ChartCrosshairService } from '../../services/interactions/chart-crosshair.service';
import { SmaPeriod, SmaVisibilityService } from '../../services/charts/sma/sma-visibility.service';
import { PanelPreferenceService } from '../../support/panel-workspace/panel-preference.service';

@Component({
  selector: 'base-chart',
  standalone: true,
  templateUrl: './base-chart.component.html',
  styleUrl: './base-chart.component.scss'
})
export abstract class BaseChartComponent implements OnChanges, AfterViewInit {
  private readonly crosshairService = inject(ChartCrosshairService);
  private readonly panelPreferenceService = inject(PanelPreferenceService);
  protected readonly smaVisibilityService = inject(SmaVisibilityService);

  @ViewChild('rSvg', { static: false }) rSvg!: ElementRef<SVGRectElement>;
  @ViewChild('gContent', { static: false }) gContent!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContent!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeft!: ElementRef<SVGGElement>;
  @ViewChild('rAxisGroupLeft', { static: false }) rAxisGroupLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft', { static: false }) gAxisLeft!: ElementRef<SVGGElement>;
  @ViewChild('rAxisLeft', { static: false }) rAxisLeft!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisGroupRight', { static: false }) rAxisGroupRight!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) gAxisRight!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRight', { static: false }) rAxisRight!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChart!: ElementRef<SVGGElement>;

  @Input()
  set scaffold(value: ChartScaffold | undefined) {
    if (!value) return;

    this.chartScaffold = value;
    this.layoutReady = !!this.getPanel();
    this.drawAttempted = false;
    this.checkAndDraw('scaffold@Input');
  }
  @Input() panel?: PanelAttributes;

  protected viewInitialized = false;
  protected inputsInitialized = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawAttempted = false;
  protected chartScaffold?: ChartScaffold;
  protected innerHeight = 0;

  chartType: ChartType = ChartType.Base;

  get panelBadgeX(): number {
    return this.panelBadgeWidth + 8;
  }

  get panelBadgeWidth(): number {
    if (this.crosshairService.state().readout) {
      switch (this.chartType) {
        case ChartType.OHLC: return 540;
        case ChartType.VOLUME: return 126;
        case ChartType.MACD: return 196;
        case ChartType.RSI: return 92;
      }
    }

    switch (this.chartType) {
      case ChartType.OHLC: return 224;
      case ChartType.MACD: return 126;
      case ChartType.RSI: return 58;
      default: return 72;
    }
  }

  get panelLegendItems(): ReadonlyArray<{
    label: string;
    className: string;
  }> {
    const readout = this.crosshairService.state().readout;
    if (readout) {
      switch (this.chartType) {
        case ChartType.OHLC:
          return [
            { label: 'PRICE', className: 'legend-title' },
            { label: `  ${this.formatDate(readout.date)}`, className: 'legend-value' },
            { label: `  O ${this.formatValue(readout.open)}`, className: 'legend-value' },
            { label: `  H ${this.formatValue(readout.high)}`, className: 'legend-value' },
            { label: `  L ${this.formatValue(readout.low)}`, className: 'legend-value' },
            { label: `  C ${this.formatValue(readout.close)}`, className: 'legend-value' }
          ];
        case ChartType.VOLUME:
          return [
            { label: 'VOLUME', className: 'legend-title' },
            { label: `  ${this.formatVolume(readout.volume)}`, className: 'legend-value' }
          ];
        case ChartType.MACD:
          return [
            { label: 'MACD', className: 'legend-macd' },
            { label: `  ${this.formatSigned(readout.macd)}`, className: 'legend-value' },
            { label: '  SIGNAL', className: 'legend-signal' },
            { label: `  ${this.formatSigned(readout.signal)}`, className: 'legend-value' }
          ];
        case ChartType.RSI:
          return [
            { label: 'RSI', className: 'legend-rsi' },
            { label: `  ${this.formatValue(readout.rsi)}`, className: 'legend-value' }
          ];
      }
    }

    switch (this.chartType) {
      case ChartType.OHLC:
        return [
          { label: 'PRICE', className: 'legend-title' }
        ];
      case ChartType.MACD:
        return [
          { label: 'MACD', className: 'legend-macd' },
          { label: '  SIGNAL', className: 'legend-signal' }
        ];
      case ChartType.RSI:
        return [{ label: 'RSI 14', className: 'legend-rsi' }];
      default:
        return [{ label: this.chartType, className: 'legend-title' }];
    }
  }

  get showSmaControls(): boolean {
    return this.chartType === ChartType.OHLC;
  }

  get showPanelToggle(): boolean {
    return this.chartType === ChartType.VOLUME
      || this.chartType === ChartType.MACD
      || this.chartType === ChartType.RSI;
  }

  get panelToggleLabel(): string {
    switch (this.chartType) {
      case ChartType.VOLUME: return 'Collapse Volume panel';
      case ChartType.MACD: return 'Collapse MACD panel';
      case ChartType.RSI: return 'Collapse RSI panel';
      default: return 'Collapse indicator panel';
    }
  }

  togglePanel(event: Event): void {
    if (!this.showPanelToggle) return;
    event.preventDefault();
    event.stopPropagation();

    const preference = this.panelPreferenceService.getPreferences()
      .find(item => item.chartType === this.chartType);
    if (!preference) return;

    this.panelPreferenceService.updatePreference(preference.id, { visible: false });
  }

  stopPanelTogglePointer(event: Event): void {
    if (!this.showPanelToggle) return;
    event.stopPropagation();
  }

  get smaToggleStartX(): number {
    return this.crosshairService.state().readout ? 270 : 43;
  }

  get smaToggleWidth(): number {
    return this.crosshairService.state().readout ? 90 : 60;
  }

  get smaToggleItems(): ReadonlyArray<{
    period: SmaPeriod;
    label: string;
    className: string;
  }> {
    const readout = this.crosshairService.state().readout;
    return [
      {
        period: 20,
        label: `SMA 20${readout ? ` ${this.formatValue(readout.sma20)}` : ''}`,
        className: 'legend-sma-20'
      },
      {
        period: 50,
        label: `SMA 50${readout ? ` ${this.formatValue(readout.sma50)}` : ''}`,
        className: 'legend-sma-50'
      },
      {
        period: 150,
        label: `SMA 150${readout ? ` ${this.formatValue(readout.sma150)}` : ''}`,
        className: 'legend-sma-150'
      }
    ];
  }

  isSmaVisible(period: SmaPeriod): boolean {
    return this.smaVisibilityService.isVisible(period);
  }

  stopSmaTogglePointer(event: Event, period?: SmaPeriod): void {
    if (!period) return;
    event.stopPropagation();
  }

  toggleSma(event: Event, period?: SmaPeriod): void {
    if (!period) return;
    event.preventDefault();
    event.stopPropagation();
    this.smaVisibilityService.toggle(period);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private formatValue(value: number | undefined): string {
    return value === undefined ? '—' : value.toFixed(2);
  }

  private formatSigned(value: number | undefined): string {
    if (value === undefined) return '—';
    const formatted = value.toFixed(2);
    return value > 0 ? `+${formatted}` : formatted;
  }

  private formatVolume(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toFixed(0);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  ngOnChanges(_: SimpleChanges): void {
    this.layoutReady = !!this.getPanel();
    this.drawAttempted = false;
    this.checkAndDraw('ngOnChanges');
  }

  protected getPanel(): PanelAttributes | undefined {
    return this.panel ?? this.chartScaffold?.chartMap?.[this.chartType];
  }

  protected renderPanelChartParts(): void {

    const chart = this.chartScaffold;
    if (!chart) return;
    console.log('Rendering panel chart parts with scaffold:', chart);
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
    const axisLeftWidth = Math.max(0, chart.margins.left);
    const axisLeftHeight = Math.max(0, axisLeftRect.height);
    const axisRightWidth = Math.max(0, axisRightRect.width);
    const axisRightHeight = Math.max(0, axisRightRect.height);

    const contentLocalX = Math.max(0, contentRect.x - panelRect.x);
    const contentLocalY = Math.max(0, contentRect.y - panelRect.y);
    const axisLeftLocalX = Math.max(0, axisLeftRect.width);
    const axisLeftLocalY = Math.max(0, axisLeftRect.y - panelRect.y);
    const axisRightLocalX = Math.max(0, axisLeftRect.width + contentRect.width );        //axisRightRect.x - panelRect.x);
    const axisRightLocalY = Math.max(0, axisRightRect.y - panelRect.y);

    this.innerHeight = contentHeight;

    //select(this.gAxisGroupLeft.nativeElement)
    //  .attr('transform', `translate(${axisLeftLocalX}, ${axisLeftLocalY})`);

    select(this.gAxisLeft.nativeElement)
      .attr('transform', `translate(${axisLeftLocalX}, ${axisLeftLocalY})`);

    select(this.rAxisGroupLeft.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', axisLeftWidth)
      .attr('height', axisLeftHeight);

     select(this.rSvg.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panelWidth)
      .attr('height', panelHeight);

    select(this.gContent.nativeElement)
      .attr('transform', `translate(${contentLocalX}, ${contentLocalY})`);

    select(this.rContent.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', contentWidth)
      .attr('height', contentHeight);

    select(this.rAxisGroupRight.nativeElement)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', axisRightWidth)
      .attr('height', axisRightHeight);

    select(this.gAxisGroupRight.nativeElement)
      .attr('transform', `translate(${axisRightLocalX}, ${axisRightLocalY})`);

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

  protected interiorYTicks(
    yScale: { ticks(count?: number): number[]; (value: number): number },
    height: number,
    count: number,
    edgePadding = 10
  ): number[] {
    return yScale
      .ticks(count)
      .filter(value => {
        const y = yScale(value);
        return y >= edgePadding && y <= height - edgePadding;
      });
  }

  protected renderYAxes(
    panel: PanelAttributes,
    leftAxis: any,
    rightAxis: any
  ): void {
    const left = select(this.gAxisLeft.nativeElement);
    const right = select(this.gAxisRight.nativeElement);

    left.style('display', panel.showAxisLeft ? '' : 'none');
    right.style('display', panel.showAxisRight ? '' : 'none');

    if (panel.showAxisLeft) {
      left.call(leftAxis);
    } else {
      left.selectAll('*').remove();
    }

    if (panel.showAxisRight) {
      right.call(rightAxis);
    } else {
      right.selectAll('*').remove();
    }
  }
}