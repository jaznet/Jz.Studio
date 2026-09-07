import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { curveLinear, line as d3line } from 'd3-shape';

import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { AdxPoint } from '../../models/indicator-points.model';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate } from '../../utils/date-utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
  selector: 'adx-chart',
  templateUrl: '../base-chart/base-chart.component.html',
  styleUrls: ['./adx-chart.component.scss'],
  standalone: false
})
export class AdxChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;

  override chartType = ChartType.ADX;

  constructor(private readonly chartData: ChartDataService) { super(); }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.ADX];
    const ready = !!panel && panel.innerWidth > 0 && panel.innerHeight > 0
      && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ready, caller: 'adx.ngOnChanges' });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.ADX];
    const series = this.chartData.adxData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;

    this.innerHeight = Math.max(0, panel.innerHeight);
    const yScale = scaleLinear().domain([0, 100]).range([this.innerHeight, 0]);
    const bandwidth = this.dateScaleX.bandwidth();
    const chart = select(this.gChart.nativeElement);

    chart.selectAll<SVGLineElement, number>('.adx-guide')
      .data([20, 25])
      .join('line')
      .attr('class', 'adx-guide')
      .attr('x1', 0).attr('x2', panel.innerWidth)
      .attr('y1', value => yScale(value)).attr('y2', value => yScale(value));

    const draw = (className: string, value: (point: AdxPoint) => number): void => {
      const line = d3line<AdxPoint>()
        .x(point => (this.dateScaleX(asDate(point.date)) ?? 0) + bandwidth / 2)
        .y(point => yScale(value(point))).curve(curveLinear);
      chart.selectAll<SVGPathElement, AdxPoint[]>(`.${className}`)
        .data([series]).join('path').attr('class', className)
        .attr('d', line).attr('fill', 'none').attr('stroke-width', 1.5);
    };

    draw('adx-line', point => point.adx);
    draw('plus-di-line', point => point.plusDi);
    draw('minus-di-line', point => point.minusDi);
    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    const ticks = [20, 25, 50, 75];
    this.renderYAxes(
      panel,
      axisLeft(yScale).tickValues(ticks).tickSize(5).tickSizeOuter(0),
      axisRight(yScale).tickValues(ticks).tickSize(5).tickSizeOuter(0)
    );
  }
}
