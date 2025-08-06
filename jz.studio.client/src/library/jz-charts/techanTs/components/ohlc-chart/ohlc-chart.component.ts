import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { ohlcData } from '../../interfaces/techan-interfaces';
import { ChartType } from '../../enums/chart-type';
import { BaseChartComponent } from '../base/base-chart/base-chart.component';
import { ChartScaffold } from '../../interfaces/chart-scaffold';
import { ChartDataService } from '../../services/chart-data.service';
import { toISOStringSafe } from '../../utils/date-utils';

@Component({
  selector: 'ohlc-chart',
  templateUrl: '../base/base-chart/base-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss']
})
export class OhlcChartComponent extends BaseChartComponent implements OnChanges, AfterViewInit {
  //@Input() rOhlcSectionRef!: ElementRef<SVGRectElement>;
  @Input() data!: ohlcData[];
  @Input() dateScaleX!: any;

  //override chartScaffold!: ChartScaffold;
  //override chartType = ChartType.OHLC;
  private yScale: any;

  constructor(private chartDatta:ChartDataService) {
    super(chartDatta);
    console.log('%c⛏️ XTOR Ohlc', 'color:#EFDD8D');
  }

  override ngOnChanges(changes: SimpleChanges): void {
    console.log('%c  🟡 ngOnChanges ohlc', 'color:#EFDD8D', changes);
    const panel = this.chartScaffold?.panels?.[ChartType.OHLC];
    const inputsValid = !!panel && panel.width > 0 && panel.height > 0 && this.data?.length && this.dateScaleX;

    //if (!this.inputsReady && inputsValid) {
    //  this.markInputsReady();
    //}


    //this.tryDrawWhenReady('ngOnChanges');
  }

  //protected override sizeChartContainer(caller: string): void {
  //  if (!this.rOhlcSectionRef) {
  //    console.warn(`${caller}: rOhlcSectionRef is not set`);
  //    return;
  //  }

  //  const { width, height } = this.rOhlcSectionRef.nativeElement.getBBox();
  //  const section = this.scaffold?.sections?.[ChartType.OHLC];
  //  if (section) {
  //    section.width = width;
  //    section.height = height;
  //  }

  //  console.log(`📐 ${caller}: sized section for OHLC — ${width} x ${height}`);
  //}

  protected override drawChart(caller: string): void {
    const panel = this.chartScaffold?.panels?.[ChartType.OHLC];
    if (!panel || !this.gChartRef) {
      console.warn(`${caller}: Missing panel or gChartRef`, {
        panelMissing: !panel,
        gChartRefMissing: !this.gChartRef
      });
      return;
    }

    const g = select(this.gChartRef.nativeElement);
    console.log(`[${this.chartType}] Drawing chart in panel`, panel);

    console.log('BANDWIDTH');
    const candleWidth = this.dateScaleX.bandwidth();

    this.yScale = scaleLinear()
      .domain([
        Math.min(...this.data.map(d => d.low)),
        Math.max(...this.data.map(d => d.high))
      ])
      .range([panel.height, 0]);

    console.log('Wick data', this.data);
    console.log('📏 xScale range:', this.dateScaleX?.range?.());
    console.log('📏 xScale domain:', this.dateScaleX?.domain?.());
 
    // Wick
    g.selectAll('.wick')
      .data(this.data)
      .join('line')
      .attr('class', 'wick')
      .attr('x1', d => this.dateScaleX(toISOStringSafe(d.date))! + candleWidth / 2)
      .attr('x2', d => this.dateScaleX(toISOStringSafe(d.date))! + candleWidth / 2)
      .attr('y1', d => this.yScale(d.high))
      .attr('y2', d => this.yScale(d.low))
      .attr('stroke', '#52aa8a')
      .attr('stroke-width', 1);

    // Body
    g.selectAll('.body')
      .data(this.data)
      .join('rect')
      .attr('class', 'body')
      .attr('x', d => this.dateScaleX(toISOStringSafe(d.date)))
      .attr('y', d => this.yScale(Math.max(d.open, d.close)))
      .attr('width', candleWidth)
      .attr('height', d => Math.max(1, Math.abs(this.yScale(d.open) - this.yScale(d.close))))
      .attr('fill', d => d.close >= d.open ? '#5ec57e' : '#de4c4c');

    console.log(`✅ OHLC drawn (${caller})`);
  }
}
