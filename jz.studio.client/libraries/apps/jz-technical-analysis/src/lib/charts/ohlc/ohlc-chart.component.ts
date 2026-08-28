import {
  Component,
  effect,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { select, type Selection } from 'd3-selection';
import { scaleLinear, scaleBand, type ScaleLinear } from 'd3-scale';
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
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: any;

  smaLines: Array<{ period: number }> = [
    { period: 20 },
    { period: 50 },
    { period: 150 },
  ];

  override chartType = ChartType.OHLC;

  constructor(
    chartData: ChartDataService,
    scaffoldSvc: ChartScaffoldService,
    private smaService: SmaChartService,
    hostEl: ElementRef<SVGGElement>
  ) {
    super();
    effect(() => {
      this.smaVisibilityService.visibility();
      this.smaVisibilityService.focusedPeriod();
      if (!this.viewInitialized) return;

      this.drawAttempted = false;
      this.checkAndDraw('sma visibility');
    });
  }




  override ngOnChanges(changes: SimpleChanges): void {
    console.log('%c  🟡 ngOnChanges ohlc', 'color:#EFDD8D', changes);
    const panel = this.chartScaffold?.chartMap?.[ChartType.OHLC];
    const ok = !!panel && panel.innerWidth > 0 && panel.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'ohlc.ngOnChanges' }); // ✅ feed the base
    //const inputsValid = !!panel && panel.width > 0 && panel.height > 0 && this.data?.length && this.dateScaleX;
  }
   
  protected override createChart(caller: string): void {
    //   this.sizeChartElements();
    const panel = this.chartScaffold?.chartMap?.[ChartType.OHLC];
    if (!panel || !this.gChart) {
      console.warn(`${caller}: Missing panel or gChart`, {
        panelMissing: !panel,
        gChartMissing: !this.gChart
      });
      return;
    }

    const g = select(this.gChart.nativeElement);
    console.log(`[${this.chartType}] Drawing chart in panel`, panel);

    const dataLow = Math.min(...this.data.map(d => d.low));
    const dataHigh = Math.max(...this.data.map(d => d.high));
    const domainPadding = Math.max((dataHigh - dataLow) * 0.04, 1);

    const yScale = scaleLinear()
      .domain([dataLow - domainPadding, dataHigh + domainPadding])
      .range([panel.innerHeight, 0])
      .nice();

    g.selectAll<SVGLineElement, number>('.price-grid')
      .data(yScale.ticks(Math.max(2, Math.floor(panel.innerHeight / 56))))
      .join('line')
      .attr('class', 'price-grid')
      .attr('x1', 0)
      .attr('x2', panel.innerWidth)
      .attr('y1', value => yScale(value))
      .attr('y2', value => yScale(value));

    console.log('Wick data', this.data);
    console.log('📏 xScale range:', this.dateScaleX?.range?.());
    console.log('📏 xScale domain:', this.dateScaleX?.domain?.());

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
      .attr('class', 'wick');

    // Body
    g.selectAll('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .classed('body--up', d => d.close >= d.open)
      .classed('body--down', d => d.close < d.open)
      .attr('x', d => x0(d) + (bw - candleWidth) / 2) // center in band
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d => Math.max(1, Math.abs(yScale(d.open) - yScale(d.close))));

    console.log(`✅ OHLC drawn (${caller})`);

    this.drawSmaOverlays(g, yScale);

    this.drawYAxes(panel, yScale); // ✅ child-controlled axes
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    const tickCount = this.yTickCount(panel.innerHeight);
    const tickValues = this.interiorYTicks(yScale, panel.innerHeight, tickCount);
    const tickFormat = d3format('~f');

    this.renderYAxes(
      panel,
      axisLeft(yScale).tickValues(tickValues).tickFormat(tickFormat as any).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).tickValues(tickValues).tickFormat(tickFormat as any).tickSize(5).tickSizeOuter(0)
    );
  }

  private drawSmaOverlays(
    g: Selection<SVGGElement, unknown, null, undefined>,
    y: ScaleLinear<number, number>
  ): void {
    const calculationData = this.calculationData.length > 0
      ? this.calculationData
      : this.data;
    const closes = calculationData.map(d => d.close);
    const dates = calculationData.map(d => asDate(d.date));
    const visibleDates = new Set(
      this.data.map(d => asDate(d.date).getTime())
    );
    const group = g.selectAll('g.sma-overlays').data([0]).join('g').attr('class', 'sma-overlays');

    const lineGen = d3line<{ dt: Date; v: Num }>()
      .defined(d => d.v != null)
      .x(d => (this.dateScaleX(d.dt) ?? 0) + this.dateScaleX.bandwidth() / 2)
      .y(d => y(d.v as number))
      .curve(curveLinear);

    this.smaLines.forEach(({ period }) => {
      const series = sma(closes, period);                         // (number|null)[]
      const pathData = dates
        .map((dt, i) => ({ dt, v: series[i] as Num }))
        .filter(item => visibleDates.has(item.dt.getTime()));

      const smaPeriod = period as 20 | 50 | 150;
      const focusedPeriod = this.smaVisibilityService.focusedPeriod();
      const isFocused = focusedPeriod === smaPeriod;
      const isDeemphasized = focusedPeriod !== null && !isFocused;

      group
        .selectAll(`path.sma-${period}`)
        .data([pathData])
        .join('path')
        .attr('class', `sma-line sma-${period}`)
        .style('display', this.smaVisibilityService.isVisible(smaPeriod) ? '' : 'none')
        .style('opacity', isDeemphasized ? 0.28 : 1)
        .attr('d', lineGen as any)
        .attr('fill', 'none')
        .attr('stroke-width', isFocused ? 2.5 : 1.5);
    });
  }


}
