import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { curveLinear, line as d3line } from 'd3-shape';

import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate } from '../../utils/date-utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
  selector: 'atr-chart',
  templateUrl: '../base-chart/base-chart.component.html',
  styleUrls: ['./atr-chart.component.scss'],
  standalone: false
})
export class AtrChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;

  override chartType = ChartType.ATR;

  constructor(private readonly chartData: ChartDataService) {
    super();
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.ATR];
    const ready = !!panel
      && panel.innerWidth > 0
      && panel.innerHeight > 0
      && !!this.data?.length
      && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ready, caller: 'atr.ngOnChanges' });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.ATR];
    const series = this.chartData.atrData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;

    this.innerHeight = Math.max(0, panel.innerHeight);
    const values = series.map(item => item.value);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const padding = (maximum - minimum) * 0.08 || Math.max(maximum * 0.08, 0.1);
    const yScale = scaleLinear()
      .domain([Math.max(0, minimum - padding), maximum + padding])
      .range([this.innerHeight, 0])
      .nice();

    const bandwidth = this.dateScaleX.bandwidth();
    const line = d3line<(typeof series)[number]>()
      .x(item => (this.dateScaleX(asDate(item.date)) ?? 0) + bandwidth / 2)
      .y(item => yScale(item.value))
      .curve(curveLinear);

    select(this.gChart.nativeElement)
      .selectAll<SVGPathElement, typeof series>('.atr-line')
      .data([series])
      .join('path')
      .attr('class', 'atr-line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke-width', 1.5);

    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    this.renderYAxes(
      panel,
      axisLeft(yScale).ticks(3).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).ticks(3).tickSize(5).tickSizeOuter(0)
    );
  }
}
