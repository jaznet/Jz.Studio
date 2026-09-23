import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { axisLeft, axisRight } from 'd3-axis';
import { extent } from 'd3-array';
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

@Component({ selector: 'bollinger-width-chart', templateUrl: '../base-chart/base-chart.component.html', styleUrls: ['./bollinger-width-chart.component.scss'], standalone: false })
export class BollingerWidthChartComponent extends BaseChartComponent implements OnChanges {
  @Input() calculationData: ohlcData[] = []; @Input() data!: ohlcData[]; @Input() dateScaleX!: ScaleBand<Date>;
  override chartType = ChartType.BOLLINGER_WIDTH;
  constructor(private readonly chartData: ChartDataService) { super(); }
  override ngOnChanges(_: SimpleChanges): void { const p = this.chartScaffold?.chartMap?.[ChartType.BOLLINGER_WIDTH]; this.markReadyAndDraw({ inputsInitialized: !!p && p.innerWidth > 0 && p.innerHeight > 0 && !!this.data?.length && !!this.dateScaleX, caller: 'bollingerWidth.ngOnChanges' }); }
  protected override createChart(_: string): void {
    const panel = this.chartScaffold?.chartMap?.[ChartType.BOLLINGER_WIDTH], series = this.chartData.bollingerWidthData;
    if (!panel || !this.gChart || !series.length || !this.dateScaleX) return;
    this.innerHeight = Math.max(0, panel.innerHeight); const domain = extent(series, p => p.value) as [number, number]; const padding = (domain[1] - domain[0]) * .08 || .1; const y = scaleLinear().domain([Math.max(0, domain[0] - padding), domain[1] + padding]).range([this.innerHeight, 0]).nice(); const bw = this.dateScaleX.bandwidth();
    select(this.gChart.nativeElement).selectAll<SVGPathElement, DatedValuePoint[]>('.bollinger-width-line').data([series]).join('path').attr('class', 'bollinger-width-line').attr('d', d3line<DatedValuePoint>().x(p => (this.dateScaleX(asDate(p.date)) ?? 0) + bw / 2).y(p => y(p.value))).attr('fill', 'none').attr('stroke-width', 1.5); this.drawYAxes(panel, y);
  }
  protected override drawYAxes(panel: PanelAttributes, y: any): void { this.renderYAxes(panel, axisLeft(y).ticks(3).tickSize(5).tickSizeOuter(0), axisRight(y).ticks(3).tickSize(5).tickSizeOuter(0)); }
}
