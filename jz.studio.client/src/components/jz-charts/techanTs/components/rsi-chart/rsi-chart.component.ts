// rsi-chart.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { line as d3line, curveLinear } from 'd3-shape';

import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { asDate } from '../../utils/date-utils';     // ← use Date helper
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';

type Num = number | null;

@Component({
    selector: 'rsi-chart',
    templateUrl: '../base/base-chart/base-chart.component.html',
    styleUrls: ['./rsi-chart.component.scss'],
    standalone: false
})
export class RsiChartComponent extends BaseChartComponent implements OnChanges {
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;            // ← typed to Date
  @Input() period = 14;

  override chartType = ChartType.RSI;

  constructor(chartData: ChartDataService, scaffoldSvc: ChartScaffoldService) {
    super(chartData, scaffoldSvc);
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.RSI];
    const ok = !!panel && panel.width > 0 && panel.height > 0 && !!this.data?.length && !!this.dateScaleX;
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
    const panel = this.chartScaffold?.panels?.[ChartType.RSI];
    if (!panel || !this.gChart) return;

    // match base inner-height policy
    this.innerHeight = Math.max(0, panel.height - this.T);

    const g = select(this.gChart.nativeElement);
    const bandW = this.dateScaleX.bandwidth();
    const cx = (dt: Date) => (this.dateScaleX(dt) ?? 0) + bandW / 2;

    const closes = this.data.map(d => d.close);
    const dates = this.data.map(d => asDate(d.date));   // ← Date array for x
    const rsiVals = this.rsi(closes, this.period);

    const y = scaleLinear().domain([0, 100]).range([this.innerHeight, 0]);

    // shaded bands (overbought/oversold)
    const y70 = y(70), y30 = y(30);
    g.selectAll('.rsi-band-ob')
      .data([0]).join('rect')
      .attr('class', 'rsi-band-ob')
      .attr('x', 0).attr('width', panel.width)
      .attr('y', 0).attr('height', y70);

    g.selectAll('.rsi-band-os')
      .data([0]).join('rect')
      .attr('class', 'rsi-band-os')
      .attr('x', 0).attr('width', panel.width)
      .attr('y', y30).attr('height', Math.max(0, this.innerHeight - y30));

    // guide lines
    const guides = [70, 50, 30];
    g.selectAll('.rsi-guide')
      .data(guides).join('line')
      .attr('class', 'rsi-guide')
      .attr('x1', 0).attr('x2', panel.width)
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
      .attr('stroke', '#85ad90')
      .attr('stroke-width', 1.5);

    this.drawYAxes(panel, y);
  }

  protected override drawYAxes(panel: { width: number; height: number; margins?: any }, yScale: any): void {
    if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;

    const ticks = [0, 30, 50, 70, 100];
    select(this.gAxisLeft.nativeElement).call(axisLeft(yScale).tickValues(ticks).tickSizeOuter(0));
    select(this.gAxisRight.nativeElement).call(axisRight(yScale).tickValues(ticks).tickSizeOuter(0));
  }
}
