import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { line as d3line, curveLinear } from 'd3-shape';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { toISOStringSafe } from '../../utils/date-utils';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';

type Num = number | null | undefined;

@Component({
  selector: 'macd-chart',
  templateUrl: '../base/base-chart/base-chart.component.html',
  styleUrls: ['./macd-chart.component.scss']
})
export class MacdChartComponent extends BaseChartComponent implements OnChanges {
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: any;

  override chartType = ChartType.MACD;

  constructor(chartData: ChartDataService, scaffoldSvc: ChartScaffoldService) {
    super(chartData, scaffoldSvc);
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.MACD];
    const ok = !!panel && panel.width > 0 && panel.height > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'macd.ngOnChanges' });
  }

  // ------- math helpers -------
  private ema(values: number[], period: number): Num[] {
    if (!values.length || period <= 0) return [];
    const k = 2 / (period + 1);
    const out: Num[] = new Array(values.length).fill(null);

    // seed with SMA of first 'period'
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

    // signal is EMA(9) of the MACD line (skip nulls until first defined)
    const macdVals: number[] = macd.map(v => (v == null ? NaN : (v as number)));
    // copy but keep NaNs for warmup, EMA implementation expects contiguous numbers at start
    const firstIdx = macd.findIndex(v => v != null);
    const macdForEma: number[] = macdVals.slice();
    for (let i = 0; i < firstIdx; i++) macdForEma[i] = macdVals[firstIdx];
    const signalRaw = this.ema(macdForEma, 9);
    const signal: Num[] = signalRaw.map((v, i) => (i >= firstIdx ? v : null));
    const hist: Num[] = macd.map((v, i) =>
      v != null && signal[i] != null ? (v as number) - (signal[i] as number) : null
    );

    const iso = this.data.map(d => toISOStringSafe(d.date));
    return { iso, macd, signal, hist };
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.MACD];
    if (!panel || !this.gChart) return;

    const { width, height, margins } = panel;
    const L = margins.left, R = margins.right, T = margins.top, B = margins.bottom;
    const innerWidth = Math.max(0, width - L - R);
    const innerHeight = Math.max(0, height - T - B);

    const g = select(this.gChart.nativeElement); // already inside content (0,0)
    const bandW = this.dateScaleX.bandwidth();
    const cx = (iso: string) => this.dateScaleX(iso)! + bandW / 2;

    const { iso, macd, signal, hist } = this.buildSeries();

    // y-domain: include macd, signal, and histogram, always include 0
    let minV = 0, maxV = 0;
    const push = (v: Num) => { if (v != null) { minV = Math.min(minV, v); maxV = Math.max(maxV, v); } };
    macd.forEach(push); signal.forEach(push); hist.forEach(push);
    const pad = (maxV - minV) * 0.1 || 1;
    const yDomain = [minV - pad, maxV + pad];

    const y = scaleLinear().domain(yDomain as [number, number]).range([innerHeight, 0]).nice();

    // baseline
    g.selectAll('.macd-baseline')
      .data([0])
      .join('line')
      .attr('class', 'macd-baseline')
      .attr('x1', 0).attr('x2', innerWidth)
      .attr('y1', y(0)).attr('y2', y(0));

    // histogram (rects)
    const barW = Math.max(1, bandW * 0.7);
    g.selectAll('.macd-hist')
      .data(iso.map((k, i) => ({ k, v: hist[i] })))
      .join('rect')
      .attr('class', 'macd-hist')
      .attr('x', d => cx(d.k) - barW / 2)
      .attr('width', barW)
      .attr('y', d => d.v == null ? y(0) : Math.min(y(0), y(d.v)))
      .attr('height', d => d.v == null ? 0 : Math.abs(y(d.v) - y(0)))
      .attr('fill', d => (d.v ?? 0) >= 0 ? '#66bb6a' : '#ef5350');

    // lines
    const lineGen = d3line<{ k: string; v: Num }>()
      .defined(d => d.v != null)
      .x(d => cx(d.k))
      .y(d => y(d.v as number))
      .curve(curveLinear);

    g.selectAll('.macd-line')
      .data([iso.map((k, i) => ({ k, v: macd[i] }))])
      .join('path')
      .attr('class', 'macd-line')
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke', '#4E59D0')
      .attr('stroke-width', 1.5);

    g.selectAll('.signal-line')
      .data([iso.map((k, i) => ({ k, v: signal[i] }))])
      .join('path')
      .attr('class', 'signal-line')
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke', '#F1FEC6')
      .attr('stroke-width', 1.5);

    this.drawYAxes(panel, y);
  }

  protected override drawYAxes(panel: { width: number; height: number; margins?: any }, yScale: any): void {
    if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;
    const { height, margins } = panel as any;
    const innerHeight = Math.max(0, height - margins.top - margins.bottom);
    const ticks = this.yTickCount(innerHeight);
    select(this.gAxisLeft.nativeElement).call(axisLeft(yScale).ticks(ticks).tickSizeOuter(0));
    select(this.gAxisRight.nativeElement).call(axisRight(yScale).ticks(ticks).tickSizeOuter(0));
  }
}
