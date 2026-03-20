//volume - chart.component.ts

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { toISOStringSafe, asDate } from '../../utils/date-utils';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { ScaffoldComponent } from '../base/scaffold.component';
import { PanelAttributes } from '../../interfaces/panel-attributes.interface';

@Component({
    selector: 'volume-chart',
  templateUrl: '../base/scaffold.component.html',
    styleUrls: ['./volume-chart.component.scss'],
    standalone: false
})
export class VolumeChartComponent extends ScaffoldComponent implements OnChanges, OnInit {
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: ScaleBand<Date>;

  override chartType = ChartType.VOLUME;

  constructor(chartData: ChartDataService, scaffoldSvc: ChartScaffoldService) {
    super(chartData, scaffoldSvc);
  }

  ngOnInit(): void {
    this.L = 4;
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];
    const ok = !!panel && panel.bounds.width > 0 && panel.bounds.height > 0 && !!this.data?.length && !!this.dateScaleX;
    this.markReadyAndDraw({ inputsInitialized: ok, caller: 'volume.ngOnChanges' });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];
    if (!panel || !this.gChart) return;

    const { bounds, content } = panel;
 //   const L = margins.left, R = margins.right, T = margins.top, B = margins.bottom;

    this.innerHeight = Math.max(0, bounds.height - this.T);

    const g = select(this.gChart.nativeElement);

    const maxVol = Math.max(...this.data.map(d => d.volume ?? 0));
    const yScale = scaleLinear().domain([0, maxVol]).range([this.innerHeight, 0]).nice();

    const barW = Math.max(1, this.dateScaleX.bandwidth());
    g.selectAll('.vol-bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'vol-bar')
      .attr('x', d => (this.dateScaleX(asDate(d.date)) ?? 0))              // <— pass Date, not string
      .attr('y', d => yScale(d.volume ?? 0))
      .attr('width', barW)
      .attr('height', d => Math.max(1, this.innerHeight - yScale(d.volume ?? 0))) // use innerHeight
      .attr('fill', d => (d.close >= d.open ? '#5AA469' : '#D46A6A'));

    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    if (!this.gAxisGroupLeft || !this.gAxisLeft || !this.gAxisGroupRight || !this.gAxisRight) return;
    const { height, margins } = panel as any;
    this.innerHeight = Math.max(0, height - this.L);
    const ticks = this.yTickCount(this.innerHeight);

    select(this.gAxisLeft.nativeElement).call(axisLeft(yScale).ticks(ticks).tickSizeOuter(0));
    select(this.gAxisRight.nativeElement).call(axisRight(yScale).ticks(ticks).tickSizeOuter(0));
  }
}
