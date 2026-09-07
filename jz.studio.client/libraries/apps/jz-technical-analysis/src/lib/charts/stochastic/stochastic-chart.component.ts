import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { curveLinear, line as d3line } from 'd3-shape';

import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { StochasticPoint } from '../../models/indicator-points.model';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate } from '../../utils/date-utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
  selector: 'stochastic-chart',
  templateUrl: '../base-chart/base-chart.component.html',
  styleUrls: ['./stochastic-chart.component.scss'],
  standalone: false
})
export class StochasticChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;

  override chartType = ChartType.STOCHASTIC;

  constructor(private readonly chartData: ChartDataService) {
    super();
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.STOCHASTIC];
    const ready = !!panel
      && panel.innerWidth > 0
      && panel.innerHeight > 0
      && !!this.data?.length
      && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ready, caller: 'stochastic.ngOnChanges' });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.STOCHASTIC];
    const series = this.chartData.stochasticData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;

    this.innerHeight = Math.max(0, panel.innerHeight);
    const yScale = scaleLinear()
      .domain([0, 100])
      .range([this.innerHeight, 0]);
    const bandwidth = this.dateScaleX.bandwidth();

    const drawLine = (
      className: string,
      value: (point: StochasticPoint) => number
    ): void => {
      const line = d3line<StochasticPoint>()
        .x(point => (this.dateScaleX(asDate(point.date)) ?? 0) + bandwidth / 2)
        .y(point => yScale(value(point)))
        .curve(curveLinear);

      select(this.gChart.nativeElement)
        .selectAll<SVGPathElement, StochasticPoint[]>(`.${className}`)
        .data([series])
        .join('path')
        .attr('class', className)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke-width', 1.5);
    };

    const chart = select(this.gChart.nativeElement);
    chart.selectAll<SVGLineElement, number>('.stochastic-guide')
      .data([20, 80])
      .join('line')
      .attr('class', 'stochastic-guide')
      .attr('x1', 0)
      .attr('x2', panel.innerWidth)
      .attr('y1', value => yScale(value))
      .attr('y2', value => yScale(value));

    drawLine('stochastic-k-line', point => point.k);
    drawLine('stochastic-d-line', point => point.d);
    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    const tickValues = [20, 50, 80];
    this.renderYAxes(
      panel,
      axisLeft(yScale).tickValues(tickValues).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).tickValues(tickValues).tickSize(5).tickSizeOuter(0)
    );
  }
}
