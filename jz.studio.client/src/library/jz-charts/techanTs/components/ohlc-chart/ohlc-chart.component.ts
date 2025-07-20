import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { ohlcData, scaffold } from '../../interfaces/techan-interfaces';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ChartType } from '../../enums/chart-type';

@Component({
  selector: 'ohlc-chart',
  templateUrl: '../base/base-chart/base-chart.component.html',  // reuse base layout
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent extends BaseChartComponent implements OnChanges {
  @Input() rOhlcSectionRef!: ElementRef<SVGRectElement>;

  @Input() data!: ohlcData[];
  @Input() xScale!: any;



  private yScale: any;

  constructor() {
    super();
    this.chartType = ChartType.OHLC;
    console.log('%c⛏️ XTOR Ohlc', 'color:#A3C4BC');
  }

  override ngOnChanges(changes: SimpleChanges): void {
    console.log('%c _changes ohlc', changes);
    const section = this.scaffold?.sections?.[ChartType.OHLC];
    const inputsValid = !!this.scaffold && !!section && section.width > 0 && section.height > 0 && this.data?.length && this.xScale;

    if (!this.inputsReady && inputsValid) {
      this.markInputsReady();
    }

    this.tryDrawWhenReady('ngOnChanges');
  }

  protected override sizeChartContainer(caller: string): void {
    console.log('%c    ✔ sizeChartContainer called by', 'color:goldenrod', this.rOhlcSectionRef);
    select(this.rOhlcSectionRef.nativeElement).attr('width', '400').attr('height','400');
  }

  protected override drawChart(caller: string): void {
   
    const section = this.scaffold?.sections?.[ChartType.OHLC];
    if (!section || !this.gChartRef) {
      console.warn(`${caller}: Missing section or gChartRef`);
      return;
    }

    const g = select(this.gChartRef.nativeElement);
    const candleWidth = this.xScale.bandwidth();

    this.yScale = scaleLinear()
      .domain([
        Math.min(...this.data.map(d => d.low)),
        Math.max(...this.data.map(d => d.high))
      ])
      .range([section.height, 0]);

    // Wick
    console.log(this.data, this.xScale);
    g.selectAll('.wick')
      .data(this.data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', d => this.xScale(new Date(d.date)) + candleWidth / 2)
      .attr('x2', d => this.xScale(new Date(d.date)) + candleWidth / 2)
      .attr('y1', d => this.yScale(d.high))
      .attr('y2', d => this.yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    // Body
    g.selectAll('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .attr('x', d => this.xScale(new Date(d.date)))
      .attr('y', d => this.yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d => Math.max(1, Math.abs(this.yScale(d.open) - this.yScale(d.close))))
      .attr('fill', d => d.close >= d.open ? '#5ec57e' : '#de4c4c');

    console.log(`✅ OHLC drawn (${caller})`);
  }
}
