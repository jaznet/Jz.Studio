import { Component, ViewChild, ElementRef, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { select, selection, selector } from 'd3-selection';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { scaffold } from '../../interfaces/techan-interfaces';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent extends BaseChartComponent implements OnChanges, OnInit {

  ohlcYscale: any;

  //override ngOnChanges(changes: SimpleChanges): void {
  //  if (this.viewReady && this.data?.length && this.xScale && this.scaffold) {
  //    this.tryDrawChart();
  //  }
  //}

  ngOnInit(): void {
    this.chartType = ChartType.OHLC;
  }

  //override ngAfterViewInit(): void {
  //  console.log('%c  ✅ OhlcChartComponent ngAfterViewInit', 'color:#F4E8C1');

  //  //this.layoutService.ohlcSizeReady$.pipe(take(1)).subscribe(({ width, height }) => {
  //  //  this.setSize(width, height);
  //  //  this.viewReady = true;
  //  //  this.tryDrawChart();
  //  //});
  //}

  protected override tryDrawChart(): void {
    if (!this.viewReady || !this.data?.length || !this.xScale || !this.scaffold) return;
    console.log('%c🕯️ Drawing OHLC Chart', 'color:#F4E8C1');
    this.draw();
  }

  draw() {
    const section = this.scaffold.sections[ChartType.OHLC];
    const candleWidth = this.xScale.bandwidth();

     this.ohlcYscale = scaleLinear()
      .domain([Math.min(...this.data.map(d => d.low)), Math.max(...this.data.map(d => d.high))])
      .range([section!.height, 0]);

    const gChart = select(this.gChartRef.nativeElement);

    // Draw wicks
    const wicks = gChart.selectAll<SVGLineElement, ohlcData>('.wick').data(this.data);

    wicks.enter()
      .append('line')
      .attr('class', 'wick')
      .merge(wicks)
      .attr('x1', (d: ohlcData) => this.xScale(d.date.toISOString()) + candleWidth / 2)
      .attr('x2', (d: ohlcData) => this.xScale(d.date.toISOString()) + candleWidth / 2)
      .attr('y1', (d: ohlcData) => this.ohlcYscale(d.high))
      .attr('y2', (d: ohlcData) => this.ohlcYscale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    wicks.exit().remove();

    // Draw candles
    const candles = gChart.selectAll<SVGRectElement, ohlcData>('.candle').data(this.data);

    candles.enter()
      .append('rect')
      .attr('class', 'candle')
      .merge(candles)
      .attr('x', (d: ohlcData) => this.xScale(d.date.toISOString()))
      .attr('y', (d: ohlcData) => this.ohlcYscale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', (d: ohlcData) => Math.abs(this.ohlcYscale(d.open) - this.ohlcYscale(d.close)))
      .attr('fill', (d: ohlcData) => (d.open > d.close ? '#bf211e' : 'seagreen'));

    candles.exit().remove();
  }
}
