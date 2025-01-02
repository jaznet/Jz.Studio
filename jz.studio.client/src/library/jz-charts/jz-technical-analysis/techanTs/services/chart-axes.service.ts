import { Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll } from 'd3-selection';
import { ChartLayoutService } from './chart-layout.service';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  candlestickXaxis: any;
  candlestickYaxis: any;

  gXaxisGroupTop: any;
  gXaxisGroupBottom: any;
  gYaxisGroupLeft: any;
  gYaxisGroupRight: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {

    this.gXaxisGroupTop = select(this.gYaxisGroupRight.nativeElement);
    this.gYaxisGroupRight = select(this.gYaxisGroupRight.nativeElement);
    this.gXaxisGroupBottom = select(this.gXaxisGroupBottom.nativeElement)
      .attr('transform', `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.height - this.layout.sectionA.margins.bottom})`);
    this.gYaxisGroupLeft = select(this.gYaxisGroupLeft.nativeElement)
      .attr('transform', `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.margins.top})`);
    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'

    // CANDLESTICK
    this.candlestickXaxis = axisBottom(this.scales.candlestickXscale)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));

    this.candlestickYaxis = axisLeft(this.scales.candlestickYscale);



    //this.gXaxisGroupTop.call(this.candlestickXaxis.nativeElement);
    //this.gYaxisGroupRight.call(this.candlestickYaxis.nativeElement);
    //this.gXaxisGroupBottom.call(this.candlestickXaxis.nativeElement);
    //this.gYaxisGroupLeft.call(this.candlestickYaxis.nativeElement);
  }
}
