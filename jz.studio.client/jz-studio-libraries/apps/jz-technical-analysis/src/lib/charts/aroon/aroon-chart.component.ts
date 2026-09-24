import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { line as d3line } from 'd3-shape';
import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { AroonPoint } from '../../models/indicator-points.model';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate } from '../../utils/date-utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({ selector: 'aroon-chart', templateUrl: '../base-chart/base-chart.component.html', styleUrls: ['./aroon-chart.component.scss'], standalone: false })
export class AroonChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = [];
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;
  override chartType = ChartType.AROON;
  constructor(private readonly chartData: ChartDataService) { super(); }
  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.AROON];
    this.markReadyAndDraw({ inputsInitialized: !!panel && panel.innerWidth > 0 && panel.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX, caller: 'aroon.ngOnChanges' });
  }
  protected override createChart(_: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.AROON], series = this.chartData.aroonData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;
    this.innerHeight = Math.max(0, panel.innerHeight);
    const y = scaleLinear().domain([0, 100]).range([this.innerHeight, 0]);
    const bandwidth = this.dateScaleX.bandwidth(), chart = select(this.gChart.nativeElement);
    const draw = (css: string, value: (p: AroonPoint) => number) => chart.selectAll<SVGPathElement, AroonPoint[]>(`.${css}`).data([series]).join('path').attr('class', css).attr('d', d3line<AroonPoint>().x(p => (this.dateScaleX(asDate(p.date)) ?? 0) + bandwidth / 2).y(p => y(value(p)))).attr('fill', 'none').attr('stroke-width', 1.5);
    draw('aroon-up-line', p => p.up); draw('aroon-down-line', p => p.down);
    this.drawYAxes(panel, y);
  }
  protected override drawYAxes(panel: PanelAttributes, y: any): void {
    const ticks = [0, 50, 100];
    this.renderYAxes(panel, axisLeft(y).tickValues(ticks).tickSize(5).tickSizeOuter(0), axisRight(y).tickValues(ticks).tickSize(5).tickSizeOuter(0));
  }
}
