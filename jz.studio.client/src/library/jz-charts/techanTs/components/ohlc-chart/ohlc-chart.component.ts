
import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { scaffold } from '../../interfaces/techan-interfaces';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent implements AfterViewInit, OnChanges {

  @Input() data!: ohlcData[];
  @Input() xScale!: any;
  @Input() scaffold!: scaffold;

  @ViewChild('gChart', { static: true }) gChartRef!: ElementRef<SVGGElement>;

  private yScale: any;
  viewReady= false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryDrawWhenReady();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tryDrawWhenReady();
  }

  private tryDrawWhenReady(): void {
    if (
      this.viewReady &&
      this.data?.length &&
      this.xScale &&
      this.scaffold
    ) {
      this.drawChart();
    }
  }

  public drawChart(): void {
    if (!this.data?.length || !this.xScale || !this.scaffold) return;

    const g = select(this.gChartRef.nativeElement);
    const section = this.scaffold.sections[ChartType.OHLC];
    const candleWidth = this.xScale.bandwidth();

    // 1. Y Scale
    this.yScale = scaleLinear()
      .domain([
        Math.min(...this.data.map(d => d.low)),
        Math.max(...this.data.map(d => d.high))
      ])
      .range([section!.height, 0]);

    // 2. Draw wicks
    const wicks = g.selectAll<SVGLineElement, ohlcData>('.wick')
      .data(this.data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', d => this.xScale(d.date.toISOString()) + candleWidth / 2)
      .attr('x2', d => this.xScale(d.date.toISOString()) + candleWidth / 2)
      .attr('y1', d => this.yScale(d.high))
      .attr('y2', d => this.yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    // 3. Draw candlestick bodies (optional)
    const bodies = g.selectAll<SVGRectElement, ohlcData>('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .attr('x', d => this.xScale(d.date.toISOString()))
      .attr('y', d => this.yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d =>
        Math.max(1, Math.abs(this.yScale(d.open) - this.yScale(d.close)))
      )
      .attr('fill', d => d.close >= d.open ? '#5ec57e' : '#de4c4c');
  }
}
