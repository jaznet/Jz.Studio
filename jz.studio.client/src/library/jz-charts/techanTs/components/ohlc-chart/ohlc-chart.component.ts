import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { ChartType } from '../../enums/chart-type';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent extends BaseChartComponent implements OnChanges, AfterViewInit {
  @Input() data!: ohlcData[];
  @Input() xScale!: any;

  //@ViewChild('gChart', { static: false }) public gChartRef!: ElementRef<SVGGElement>;
  //@ViewChild('rChart', { static: false }) public rChartRef!: ElementRef<SVGRectElement>;

  private yScale: any;

  constructor() {
    super();
 
    console.log('⛏️ XTOR Ohlc');

    this.chartType = ChartType.OHLC; // ✅ safe: hardcoded value
  }


  override ngOnChanges(): void {
    const section = this.scaffold?.sections?.[ChartType.OHLC];

    console.log('%c 🟡 ngOnChanges() ohlc ', 'color:#EAE2AB', this.inputsReady, this.data.length, this.xScale);
    if (!this.inputsReady
      && !!this.scaffold
      && !!section
      && section.width > 0
      && section.height > 0
      && this.data?.length
      && this.xScale) {
      this.markInputsReady();
    }

    this.tryDrawWhenReady();
  }

  public override tryDrawWhenReady(): void {
    const section = this.scaffold?.sections[ChartType.OHLC];

    const isSized = !!section && section.width > 0 && section.height > 0;

    if (this.viewReady && this.data?.length && this.xScale && isSized) {
      this.drawChart('tryDrawWhenReady');
    }
    else {
      console.log('%c    ⌛  Waiting to draw: ready?','color:#EAE2AB', this.viewReady, 'sized?', isSized);
    }
  }

  protected override drawChart(caller: string): void {
    if (!this.gChartRef) {
      console.warn('gChartRef not yet available');
      return;
    }
    const sel = select(this.gChartRef.nativeElement);


    console.log('scaffold', this.scaffold);

    console.log('drawChart called from', caller);

    const r = select(super.rContentRef.nativeElement);

    const g = select(this.gChartRef.nativeElement);
    const section = this.scaffold.sections[ChartType.OHLC];
    const candleWidth = this.xScale.bandwidth();

    this.yScale = scaleLinear()
      .domain([
        Math.min(...this.data.map(d => d.low)),
        Math.max(...this.data.map(d => d.high))
      ])
      .range([section!.height, 0]);

    g.selectAll<SVGLineElement, ohlcData>('.wick')
      .data(this.data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', d => this.xScale(new Date(d.date).toISOString()) + candleWidth / 2)
      .attr('x2', d => this.xScale(new Date(d.date).toISOString()) + candleWidth / 2)

      .attr('y1', d => this.yScale(d.high))
      .attr('y2', d => this.yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    g.selectAll<SVGRectElement, ohlcData>('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .attr('x', d => this.xScale(new Date(d.date).toISOString()))
      .attr('y', d => this.yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d =>
        Math.max(1, Math.abs(this.yScale(d.open) - this.yScale(d.close)))
      )
      .attr('fill', d => d.close >= d.open ? '#5ec57e' : '#de4c4c');
  }
}
