import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { toISOStringSafe } from '../../utils/date-utils';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';

@Component({
  selector: 'volume-chart',
  templateUrl: '../base/base-chart/base-chart.component.html',
  styleUrls: ['./volume-chart.component.scss']
})
export class VolumeChartComponent extends BaseChartComponent implements OnChanges {
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: any;

  override chartType = ChartType.VOLUME;

  constructor(chartData: ChartDataService, scaffoldSvc: ChartScaffoldService) {
    super(chartData, scaffoldSvc);
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];
    const ok = !!panel && panel.width > 0 && panel.height > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'volume.ngOnChanges' });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];
    if (!panel || !this.gChart) return;

    const { height, margins } = panel;
 //   const L = margins.left, R = margins.right, T = margins.top, B = margins.bottom;
    const L = 0, R = 0, T = 4, B = 0;
    const innerHeight = Math.max(0, height - T - B);

    const g = select(this.gChart.nativeElement);

    const maxVol = Math.max(...this.data.map(d => d.volume ?? 0));
    const yScale = scaleLinear().domain([0, maxVol]).range([innerHeight, 0]).nice();

    const barW = Math.max(1, this.dateScaleX.bandwidth());
    g.selectAll('.vol-bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'vol-bar')
      .attr('x', d => this.dateScaleX(toISOStringSafe(d.date))!)
      .attr('y', d => yScale(d.volume ?? 0))
      .attr('width', barW)
      .attr('height', d => height - yScale(d.volume ?? 0))
      .attr('fill', d => (d.close >= d.open ? '#5AA469' : '#D46A6A'));

    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: { width: number; height: number; margins?: any }, yScale: any): void {
    if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;
    const { height, margins } = panel as any;
    const innerHeight = Math.max(0, height - margins.top - margins.bottom);
    const ticks = this.yTickCount(innerHeight);

    select(this.gAxisLeft.nativeElement).call(axisLeft(yScale).ticks(ticks).tickSizeOuter(0));
    select(this.gAxisRight.nativeElement).call(axisRight(yScale).ticks(ticks).tickSizeOuter(0));
  }
}
