// volume-chart.component.ts

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, type ScaleBand } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';

import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { asDate } from '../../utils/date-utils';
import { ChartDataService } from '../../services/chart-data.service';
import { ChartScaffoldService } from '../../services/chart-scaffold.service';
import { ScaffoldComponent } from '../base/scaffold.component';
import { PanelAttributes } from '../../interfaces/panel-interfaces';

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

  constructor(
    chartData: ChartDataService,
    scaffoldSvc: ChartScaffoldService
  ) {
    super(chartData, scaffoldSvc);
  }

  ngOnInit(): void {
    // No legacy margin math needed here anymore.
  }

  override ngOnChanges(_: SimpleChanges): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];

    const ok =
      !!panel &&
      (panel.contentRect?.width ?? 0) > 0 &&
      (panel.contentRect?.height ?? 0) > 0 &&
      !!this.data?.length &&
      !!this.dateScaleX;

    this.markReadyAndDraw({
      inputsInitialized: ok,
      caller: 'volume.ngOnChanges'
    });
  }

  protected override createChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.VOLUME];
    if (!panel || !this.gChart || !this.data?.length || !this.dateScaleX) return;

    const contentWidth = Math.max(0, panel.contentRect.width ?? 0);
    const contentHeight = Math.max(0, panel.contentRect.height ?? 0);

    this.innerHeight = contentHeight;

    const g = select(this.gChart.nativeElement);

    const maxVol = Math.max(...this.data.map(d => d.volume ?? 0), 0);

    const yScale = scaleLinear()
      .domain([0, maxVol])
      .range([contentHeight, 0])
      .nice();

    const barW = Math.max(1, this.dateScaleX.bandwidth());

    g.selectAll<SVGRectElement, ohlcData>('.vol-bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'vol-bar')
      .attr('x', d => this.dateScaleX(asDate(d.date)) ?? 0)
      .attr('y', d => yScale(d.volume ?? 0))
      .attr('width', barW)
      .attr('height', d => Math.max(1, contentHeight - yScale(d.volume ?? 0)))
      .attr('fill', d => (d.close >= d.open ? '#5AA469' : '#D46A6A'));

    this.drawYAxes(panel, yScale);
  }

  protected override drawYAxes(panel: PanelAttributes, yScale: any): void {
    if (!this.gAxisLeft || !this.gAxisRight) return;

    const contentHeight = Math.max(0, panel.contentRect.height ?? 0);
    this.innerHeight = contentHeight;

    const ticks = this.yTickCount(contentHeight);

    select(this.gAxisLeft.nativeElement)
      .call(
        axisLeft(yScale)
          .ticks(ticks)
          .tickSizeOuter(0)
      );

    select(this.gAxisRight.nativeElement)
      .call(
        axisRight(yScale)
          .ticks(ticks)
          .tickSizeOuter(0)
      );
  }
}
