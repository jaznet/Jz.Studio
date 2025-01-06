import { ElementRef, Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll } from 'd3-selection';
import { ChartLayoutService } from './chart-layout.service';
import { Selection } from 'd3-v4';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  candlestickXaxis: any;
  candlestickYaxis: any;

  xAxisTop!: any;
  yAxisRight: any;
  xAxisBottom: any;
  yAxisLeft: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {

    this.xAxisTop = select(this.layout.xAxisTopA);
    //this.gYaxisGroupRight = select(this.gYaxisGroupRight.nativeElement);
    //this.gXaxisGroupBottom = select(this.gXaxisGroupBottom.nativeElement)
    //  .attr('transform', `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.height - this.layout.sectionA.margins.bottom})`);
    //this.gYaxisGroupLeft = select(this.gYaxisGroupLeft.nativeElement)
    //  .attr('transform', `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.margins.top})`);

    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'

    // CANDLESTICK
    this.candlestickXaxis = axisBottom(this.scales.candlestickXscale)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));
    console.log(this.candlestickXaxis);
    this.candlestickYaxis = axisLeft(this.scales.candlestickYscale);
    console.log(this.candlestickYaxis);
    this.xAxisTop.call(this.candlestickXaxis);
    //this.gYaxisGroupRight.call(this.candlestickYaxis.nativeElement);
    //this.gXaxisGroupBottom.call(this.candlestickXaxis.nativeElement);
    //this.gYaxisGroupLeft.call(this.candlestickYaxis.nativeElement);
  }
}
