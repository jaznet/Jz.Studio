// rsi-chart.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { line as d3line, curveLinear } from 'd3-shape';

import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { asDate } from '../../utils/date-utils';     // ← use Date helper
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { BaseChartComponent } from '../base-chart/base-chart.component';

type Num = number | null;

@Component({
    selector: 'rsi-chart',
    templateUrl: '../base-chart/base-chart.component.html',
    styleUrls: ['./rsi-chart.component.scss'],
    standalone: false
})
export class RsiChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;            // ← typed to Date
  @Input() period = 14;

  override chartType = ChartType.RSI;

  constructor(chartData: ChartDataService, scaffoldSvc: ChartScaffoldService) {
    super();
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.RSI];
    const ok = !!panel && panel.innerWidth > 0 && panel.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'rsi.ngOnChanges' });
  }

  // Wilder's RSI (EMA-like smoothing)
  private rsi(values: number[], period: number): Num[] {
    if (!values.length || period <= 0) return [];
    const out: Num[] = new Array(values.length).fill(null);

    let gainSum = 0, lossSum = 0;
    for (let i = 1; i <= period; i++) {
      const ch = values[i] - values[i - 1];
      if (ch >= 0) gainSum += ch; else lossSum -= ch;
    }
    let avgGain = gainSum / period;
    let avgLoss = lossSum / period;
    out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

    for (let i = period + 1; i < values.length; i++) {
      const ch = values[i] - values[i - 1];
      const gain = Math.max(ch, 0);
      const loss = Math.max(-ch, 0);
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
    return out;
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.RSI];
    if (!panel || !this.gChart) return;

    // match base inner-height policy
    this.innerHeight = Math.max(0, panel.innerHeight)

    const g = select(this.gChart.nativeElement);
    const bandW = this.dateScaleX.bandwidth();
    const cx = (dt: Date) => (this.dateScaleX(dt) ?? 0) + bandW / 2;

    const calculationData = this.calculationData.length > 0
      ? this.calculationData
      : this.data;
    const closes = calculationData.map(d => d.close);
    const rsiValues = this.rsi(closes, this.period);
    const visibleDates = new Set(
      this.data.map(d => asDate(d.date).getTime())
    );
    const visibleSeries = calculationData
      .map((item, index) => ({
        date: asDate(item.date),
        value: rsiValues[index]
      }))
      .filter(item => visibleDates.has(item.date.getTime()));
    const dates = visibleSeries.map(item => item.date);
    const rsiVals = visibleSeries.map(item => item.value);

    const y = scaleLinear().domain([0, 100]).range([this.innerHeight, 0]);

    // shaded bands (overbought/oversold)
    const y70 = y(70), y30 = y(30);
    g.selectAll('.rsi-band-ob')
      .data([0]).join('rect')
      .attr('class', 'rsi-band-ob')
      .attr('x', 0).attr('width', panel.innerWidth)
      .attr('y', 0).attr('height', y70);

    g.selectAll('.rsi-band-os')
      .data([0]).join('rect')
      .attr('class', 'rsi-band-os')
      .attr('x', 0).attr('width', panel.innerWidth)
      .attr('y', y30).attr('height', Math.max(0, this.innerHeight - y30));

    // guide lines
    const guides = [70, 50, 30];
    g.selectAll('.rsi-guide')
      .data(guides).join('line')
      .attr('class', 'rsi-guide')
      .attr('x1', 0).attr('x2', panel.innerWidth)
      .attr('y1', d => y(d)).attr('y2', d => y(d));

    // RSI line
    const lineGen = d3line<{ dt: Date; v: Num }>()
      .defined(d => d.v != null)
      .x(d => cx(d.dt))
      .y(d => y(d.v as number))
      .curve(curveLinear);

    g.selectAll('.rsi-line')
      .data([dates.map((dt, i) => ({ dt, v: rsiVals[i] }))])
      .join('path')
      .attr('class', 'rsi-line')
      .attr('d', lineGen as any)
      .attr('fill', 'none')
      .attr('stroke-width', 1.5);

    this.drawYAxes(panel, y);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    const tickValues = [30, 50, 70];

    this.renderYAxes(
      panel,
      axisLeft(yScale).tickValues(tickValues).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).tickValues(tickValues).tickSize(5).tickSizeOuter(0)
    );
  }
}
