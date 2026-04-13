import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { format as d3format } from 'd3-format';
import { line as d3line, curveLinear } from 'd3-shape';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { ChartType } from '../../enums/chart-type';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate, toISOStringSafe } from '../../utils/date-utils';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { sma, type Num } from '../../utils/ta-math';
import { SmaChartService } from '../../services/charts/sma/chart-sma.service';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
    selector: 'ohlc-chart',
    templateUrl: '../base-chart/base-chart.component.html',
    styleUrls: ['./ohlc-chart.component.scss'],
    standalone: true
})
export class OhlcChartComponent extends BaseChartComponent implements OnChanges {

  //@Input() rOhlcSectionRef!: ElementRef<SVGRectElement>;
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: any;

  smaLines: Array<{ period: number; color: string }> = [
    { period: 20, color: '#ff0000' },
    { period: 50, color: '#00ff00' },
    { period: 150, color: '#0000ff' },
  ];

  override chartType = ChartType.OHLC;

  constructor(
    chartData: ChartDataService,
    scaffoldSvc: ChartScaffoldService,
    private smaService: SmaChartService,
    hostEl: ElementRef<SVGGElement>
  ) { super(); }




  override ngOnChanges(changes: SimpleChanges): void {
    console.log('%c  🟡 ngOnChanges ohlc', 'color:#EFDD8D', changes);
    const panel = this.chartScaffold?.panels?.[ChartType.OHLC];
    const ok = !!panel && panel.innerWidth > 0 && panel.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'ohlc.ngOnChanges' }); // ✅ feed the base
    //const inputsValid = !!panel && panel.width > 0 && panel.height > 0 && this.data?.length && this.dateScaleX;
  }
   
  protected override createChart(caller: string): void {
 //   this.sizeChartElements();
    const panel = this.chartScaffold?.panels?.[ChartType.OHLC];
    if (!panel || !this.gChart) {
      console.warn(`${caller}: Missing panel or gChart`, {
        panelMissing: !panel,
        gChartMissing: !this.gChart
      });
      return;
    }

    const g = select(this.gChart.nativeElement);
    console.log(`[${this.chartType}] Drawing chart in panel`, panel);

    const yScale = scaleLinear()
      .domain([
        Math.min(...this.data.map(d => d.low)),
        Math.max(...this.data.map(d => d.high))
      ])
      .range([panel.innerHeight, 0])
      .nice();

    console.log('Wick data', this.data);
    console.log('📏 xScale range:', this.dateScaleX?.range?.());
    console.log('📏 xScale domain:', this.dateScaleX?.domain?.());

    const dates = this.data.map(d => asDate(d.date)); // Date[]
    const bw = this.dateScaleX.bandwidth();
    const candleWidth = Math.max(1, bw * 0.99);

    const x0 = (d: { date: Date | string }) => {
      const dt = d.date instanceof Date ? d.date : new Date(d.date);
      const x = this.dateScaleX(dt);
      return x == null ? 0 : x; // fallback if date wasn’t in domain
    };
 
    // Wick
    g.selectAll('.wick')
      .data(this.data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', d => x0(d) + bw / 2)
      .attr('x2', d => x0(d) + bw / 2)
      .attr('y1', d => yScale(d.high))
      .attr('y2', d => yScale(d.low))
      .attr('stroke', '#B0BEC5')
      .attr('stroke-width', 2);

    // Body
    g.selectAll('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .attr('x', d => x0(d) + (bw - candleWidth) / 2) // center in band
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d => Math.max(1, Math.abs(yScale(d.open) - yScale(d.close))))
      .attr('fill', d => (d.close >= d.open ? '#66bb6a' : '#ef5350'));

    console.log(`✅ OHLC drawn (${caller})`);

    this.drawSmaOverlays(g, dates, yScale);

    this.drawYAxes(panel, yScale); // ✅ child-controlled axes
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;

    // OHLC-specific axis policy (tune as you like)
    const tickCount = Math.max(2, Math.floor(panel.innerHeight / 40));
    const tickFormat = d3format('~f');     // or d3format(',.2f') / currency

    // LEFT (price)
    select(this.gAxisGroupLeft.nativeElement)
      .attr('transform', `translate(0,0)`)
      .classed('y-axis', true);

    select(this.gAxisLeft.nativeElement)
      .call(
        axisLeft(yScale)
          .ticks(tickCount)
          .tickFormat(tickFormat as any)
          .tickSizeOuter(0)
      );

    // RIGHT (mirror)
    select(this.gAxisGroupRight.nativeElement)
      .attr('transform', `translate(${panel.innerWidth},0)`)
      .classed('y-axis', true);

    select(this.gAxisRight.nativeElement)
      .call(
        axisRight(yScale)
          .ticks(tickCount)
          .tickFormat(tickFormat as any)
          .tickSizeOuter(0)
      );
  }

  private drawSmaOverlays(g: d3.Selection<SVGGElement, unknown, null, undefined>, dates: Date[], y: d3.ScaleLinear<number, number>) {
    const closes = this.data.map(d => d.close);
    const group = g.selectAll('g.sma-overlays').data([0]).join('g').attr('class', 'sma-overlays');

    const lineGen = d3line<{ dt: Date; v: Num }>()
      .defined(d => d.v != null)
      .x(d => (this.dateScaleX(d.dt) ?? 0) + this.dateScaleX.bandwidth() / 2)
      .y(d => y(d.v as number))
      .curve(curveLinear);

    this.smaLines.forEach(({ period, color }) => {
      const series = sma(closes, period);                         // (number|null)[]
      const pathData = dates.map((dt, i) => ({ dt, v: series[i] as Num }));

      group
        .selectAll(`path.sma-${period}`)
        .data([pathData])
        .join('path')
        .attr('class', `sma-line sma-${period}`)
        .attr('d', lineGen as any)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.5);
    });
  }


}
