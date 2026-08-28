// macd-chart.component.ts
import { Component, effect, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { line as d3line, curveLinear } from 'd3-shape';
import { format as d3format } from 'd3-format';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { asDate } from '../../utils/date-utils';      // ← use Date helper, not ISO strings
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { BaseChartComponent } from '../base-chart/base-chart.component';

type Num = number | null | undefined;

@Component({
    selector: 'macd-chart',
    templateUrl: '../base-chart/base-chart.component.html',
    styleUrls: ['./macd-chart.component.scss'],
    standalone: false
})
export class MacdChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;              // ← typed to Date

  override chartType = ChartType.MACD;

  constructor() {
    super();
    effect(() => {
      this.macdVisibilityService.visibility();
      this.macdVisibilityService.focusedSeries();
      if (!this.viewInitialized) return;

      this.drawAttempted = false;
      this.checkAndDraw('macd visibility');
    });
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.MACD];
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
    const calculationData = this.calculationData.length > 0
      ? this.calculationData
      : this.data;
    const closes = calculationData.map(d => d.close);
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

    const visibleDates = new Set(
      this.data.map(d => asDate(d.date).getTime())
    );
    const visibleSeries = calculationData
      .map((item, index) => ({
        date: asDate(item.date),
        macd: macd[index],
        signal: signal[index],
        hist: hist[index]
      }))
      .filter(item => visibleDates.has(item.date.getTime()));

    return {
      dates: visibleSeries.map(item => item.date),
      macd: visibleSeries.map(item => item.macd),
      signal: visibleSeries.map(item => item.signal),
      hist: visibleSeries.map(item => item.hist)
    };
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.MACD];
    if (!panel || !this.gChart) return;

    // Use the same inner height logic as other charts
    this.innerHeight = Math.max(0, panel.panelRect.height);

    const g = select(this.gChart.nativeElement);
    const bandW = this.dateScaleX.bandwidth();
    const cx = (dt: Date) => (this.dateScaleX(dt) ?? 0) + bandW / 2;

    const { dates, macd, signal, hist } = this.buildSeries();
    const focusedSeries = this.macdVisibilityService.focusedSeries();
    const opacityFor = (series: 'macd' | 'signal' | 'histogram') =>
      focusedSeries !== null && focusedSeries !== series ? 0.28 : 1;

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
      .attr('x1', 0).attr('x2', panel.innerWidth)
      .attr('y1', y(0)).attr('y2', y(0));

    // histogram bars
    const barW = Math.max(1, bandW * 0.7);
    g.selectAll('.macd-hist')
      .data(dates.map((dt, i) => ({ dt, v: hist[i] })))
      .join('rect')
      .attr('class', 'macd-hist')
      .style('display', this.macdVisibilityService.isVisible('histogram') ? '' : 'none')
      .style('opacity', opacityFor('histogram'))
      .classed('macd-hist--positive', d => (d.v ?? 0) >= 0)
      .classed('macd-hist--negative', d => (d.v ?? 0) < 0)
      .attr('x', d => cx(d.dt) - barW / 2)
      .attr('width', barW)
      .attr('y', d => d.v == null ? y(0) : Math.min(y(0), y(d.v)))
      .attr('height', d => d.v == null ? 0 : Math.abs(y(d.v) - y(0)));

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
      .style('display', this.macdVisibilityService.isVisible('macd') ? '' : 'none')
      .style('opacity', opacityFor('macd'))
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke-width', focusedSeries === 'macd' ? 2.5 : 1.5);

    g.selectAll('.signal-line')
      .data([dates.map((dt, i) => ({ dt, v: signal[i] }))])
      .join('path')
      .attr('class', 'signal-line')
      .style('display', this.macdVisibilityService.isVisible('signal') ? '' : 'none')
      .style('opacity', opacityFor('signal'))
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke-width', focusedSeries === 'signal' ? 2.5 : 1.5);

    this.drawYAxes(panel, y);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    const innerHeight = Math.max(0, panel.innerHeight);
    const tickCount = this.yTickCount(innerHeight);
    const tickValues = this.interiorYTicks(yScale, innerHeight, tickCount);
    const tickFormat = (value: number): string =>
      Math.abs(value) >= 1
        ? d3format('.2~f')(value)
        : d3format('.2~g')(value);

    this.renderYAxes(
      panel,
      axisLeft(yScale).tickValues(tickValues).tickFormat(value => tickFormat(value as number)).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).tickValues(tickValues).tickFormat(value => tickFormat(value as number)).tickSize(5).tickSizeOuter(0)
    );
  }
}
