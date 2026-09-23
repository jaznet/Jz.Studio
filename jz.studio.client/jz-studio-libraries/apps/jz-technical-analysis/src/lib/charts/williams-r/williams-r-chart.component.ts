import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { line as d3line } from 'd3-shape';
import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { DatedValuePoint } from '../../models/indicator-points.model';
import { ChartDataService } from '../../services/chart-data.service';
import { asDate } from '../../utils/date-utils';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({ selector: 'williams-r-chart', templateUrl: '../base-chart/base-chart.component.html', styleUrls: ['./williams-r-chart.component.scss'], standalone: false })
export class WilliamsRChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = []; @Input() data!: ohlcData[]; @Input() dateScaleX!: ScaleBand<Date>;
  override chartType = ChartType.WILLIAMS_R;
  constructor(private readonly chartData: ChartDataService) { super(); }
  override ngOnChanges(_: SimpleChanges): void { const p = this.chartScaffold?.chartMap?.[ChartType.WILLIAMS_R]; this.markReadyAndDraw({ inputsInitialized: !!p && p.innerWidth > 0 && p.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX, caller: 'williamsR.ngOnChanges' }); }
  protected override createChart(_: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.WILLIAMS_R], series = this.chartData.williamsRData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;
    this.innerHeight = Math.max(0, panel.innerHeight); const y = scaleLinear().domain([-100, 0]).range([this.innerHeight, 0]); const bw = this.dateScaleX.bandwidth(); const chart = select(this.gChart.nativeElement);
    chart.selectAll<SVGLineElement, number>('.williams-guide').data([-80, -20]).join('line').attr('class', 'williams-guide').attr('x1', 0).attr('x2', panel.innerWidth).attr('y1', v => y(v)).attr('y2', v => y(v));
    chart.selectAll<SVGPathElement, DatedValuePoint[]>('.williams-r-line').data([series]).join('path').attr('class', 'williams-r-line').attr('d', d3line<DatedValuePoint>().x(p => (this.dateScaleX(asDate(p.date)) ?? 0) + bw / 2).y(p => y(p.value))).attr('fill', 'none').attr('stroke-width', 1.5); this.drawYAxes(panel, y);
  }
  protected override drawYAxes(panel: PanelAttributes, y: any): void { const ticks = [-80, -50, -20]; this.renderYAxes(panel, axisLeft(y).tickValues(ticks).tickSize(5).tickSizeOuter(0), axisRight(y).tickValues(ticks).tickSize(5).tickSizeOuter(0)); }
}
