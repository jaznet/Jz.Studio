// macd-chart.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { line as d3line, curveLinear } from 'd3-shape';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { asDate } from '../../utils/date-utils';      // ← use Date helper, not ISO strings
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { ScaffoldComponent } from '../base/scaffold.component';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { BaseChartComponent } from '../base-chart/base-chart.component';

type Num = number | null | undefined;

@Component({
    selector: 'macd-chart',
  templateUrl: '../base/scaffold.component.html',
    styleUrls: ['./macd-chart.component.scss'],
    standalone: false
})
export class MacdChartComponent extends BaseChartComponent implements OnChanges {
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;              // ← typed to Date

  override chartType = ChartType.MACD;

  constructor() {
    super();
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.MACD];
    const ok = !!panel && panel.panelRect.width > 0 && panel.panelRect.height > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'macd.ngOnChanges' });
  }

  // ------- math helpers -------
  private ema(values: number[], period: number): Num[] {
    if (!values.length || period <= 0) return [];
    const k = 2 / (period + 1);
    const out: Num[] = new Array(values.length).fill(null);
    if (values.length >= period) {
      let sum = 0;
      for (let i = 0; i < period; i++) sum += values[i];
      out[period - 1] = sum / period;
      for (let i = period; i < values.length; i++) {
        const prev = out[i - 1] as number;
        out[i] = values[i] * k + prev * (1 - k);
      }
    }
    return out;
  }

  private buildSeries() {
    const closes = this.data.map(d => d.close);
    const ema12 = this.ema(closes, 12);
    const ema26 = this.ema(closes, 26);
    const macd: Num[] = closes.map((_, i) =>
      ema12[i] != null && ema26[i] != null ? (ema12[i] as number) - (ema26[i] as number) : null
    );

    const firstIdx = macd.findIndex(v => v != null);
    const macdForEma = macd.map(v => (v == null ? NaN : (v as number)));
    for (let i = 0; i < firstIdx; i++) macdForEma[i] = macdForEma[firstIdx];

    const signalRaw = this.ema(macdForEma, 9);
    const signal: Num[] = signalRaw.map((v, i) => (i >= firstIdx ? v : null));
    const hist: Num[] = macd.map((v, i) =>
      v != null && signal[i] != null ? (v as number) - (signal[i] as number) : null
    );

    const dates = this.data.map(d => asDate(d.date)); // ← Date array for the x-scale
    return { dates, macd, signal, hist };
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.MACD];
    if (!panel || !this.gChart) return;

    // Use the same inner height logic as other charts
    this.innerHeight = Math.max(0, panel.panelRect.height);

    const g = select(this.gChart.nativeElement);
    const bandW = this.dateScaleX.bandwidth();
    const cx = (dt: Date) => (this.dateScaleX(dt) ?? 0) + bandW / 2;

    const { dates, macd, signal, hist } = this.buildSeries();

    // y-domain from macd/signal/hist + zero with padding
    let minV = 0, maxV = 0;
    const push = (v: Num) => { if (v != null) { minV = Math.min(minV, v); maxV = Math.max(maxV, v); } };
    macd.forEach(push); signal.forEach(push); hist.forEach(push);
    const pad = (maxV - minV) * 0.1 || 1;
    const y = scaleLinear()
      .domain([minV - pad, maxV + pad] as [number, number])
      .range([this.innerHeight, 0])
      .nice();

    // baseline
    g.selectAll('.macd-baseline')
      .data([0])
      .join('line')
      .attr('class', 'macd-baseline')
      .attr('x1', 0).attr('x2', panel.panelRect.width)
      .attr('y1', y(0)).attr('y2', y(0));

    // histogram bars
    const barW = Math.max(1, bandW * 0.7);
    g.selectAll('.macd-hist')
      .data(dates.map((dt, i) => ({ dt, v: hist[i] })))
      .join('rect')
      .attr('class', 'macd-hist')
      .attr('x', d => cx(d.dt) - barW / 2)
      .attr('width', barW)
      .attr('y', d => d.v == null ? y(0) : Math.min(y(0), y(d.v)))
      .attr('height', d => d.v == null ? 0 : Math.abs(y(d.v) - y(0)))
      .attr('fill', d => (d.v ?? 0) >= 0 ? '#66bb6a' : '#ef5350');

    // MACD & signal lines
    const lineGen = d3line<{ dt: Date; v: Num }>()
      .defined(d => d.v != null)
      .x(d => cx(d.dt))
      .y(d => y(d.v as number))
      .curve(curveLinear);

    g.selectAll('.macd-line')
      .data([dates.map((dt, i) => ({ dt, v: macd[i] }))])
      .join('path')
      .attr('class', 'macd-line')
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke', '#4E59D0')
      .attr('stroke-width', 1.5);

    g.selectAll('.signal-line')
      .data([dates.map((dt, i) => ({ dt, v: signal[i] }))])
      .join('path')
      .attr('class', 'signal-line')
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke', '#F1FEC6')
      .attr('stroke-width', 1.5);

    this.drawYAxes(panel, y);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    //if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;
    const innerH = Math.max(0, panel.innerHeight);
    const ticks = this.yTickCount(innerH);
    //select(this.gAxisLeft.nativeElement).call(axisLeft(yScale).ticks(ticks).tickSizeOuter(0));
    //select(this.gAxisRight.nativeElement).call(axisRight(yScale).ticks(ticks).tickSizeOuter(0));
  }
}
