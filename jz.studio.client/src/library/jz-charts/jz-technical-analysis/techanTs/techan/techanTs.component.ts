
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';



import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';

import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { CandlestickData, SectionAttributes } from '../interfaces/techan-interfaces';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../../jz-pop-overs/jz-pop-overs.service';
import { CandlestickChartComponent } from '../charts/candlestick-chart/candlestick-chart.component';
import { ChartDataService } from '../services/chart-data.service';
import { ChartLayoutService } from '../services/chart-layout.service';
import { ChartAxesService } from '../services/chart-axes.service';
import { ChartScalesService } from '../services/chart-scales.service';
import { select, selection, selectAll } from 'd3-selection';

export interface range {
  start: number;
  end: number;
}

interface DateType {
  date: Date;
  isValid: boolean;
}

interface DataType {
  date: Date | string;
  open: number;
  close: number;
}

@Component({
  selector: 'techanTs',
  templateUrl: './techanTs.component.html',
  styleUrls: ['./techanTs.component.css'] // Corrected from `styleUrl` to `styleUrls`
})
export class TechanTsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svgElementRef!: ElementRef;
  @ViewChild('svgrect', { static: true }) svgRectElementRef!: ElementRef<SVGRectElement>;
  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopOverLoadingComponent;
 
  @ViewChild('rectCandlestick', { static: true }) rectCandlestickRef!: ElementRef<SVGRectElement>;
  @ViewChild('candlestick', { static: true }) gCandlestickRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroupBottom', { static: true }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisGroupLeft', { static: true }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('sectionA', { static: true }) gSectionAref!: ElementRef<SVGGElement>;
  @ViewChild('sectionB', { static: true }) gSectionBref!: ElementRef<SVGGElement>;
  @ViewChild('sectionC', { static: true }) gSectionCref!: ElementRef<SVGGElement>;

  @ViewChild('rectA', { static: true }) rectAref!: ElementRef<SVGRectElement>;
  @ViewChild('rectB', { static: true }) rectBref!: ElementRef<SVGRectElement>;
  @ViewChild('rectC', { static: true }) rectCref!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisGroupTopRectA', { static: true }) xAxisGroupTopRectARef!: ElementRef<SVGRectElement>;
  @ViewChild('xAxisGroupBottomRectA', { static: true }) xAxisGroupBottomRectARef!: ElementRef<SVGRectElement>;
  @ViewChild('yAxisGroupLeftRectA', { static: true }) yAxisGroupLeftRectARef!: ElementRef<SVGRectElement>;
  @ViewChild('yAxisGroupRightRectA', { static: true }) yAxisGroupRightRectARef!: ElementRef<SVGRectElement>;


  gSectionA: any;
  gSectionB: any;
  gSectionC: any;

  gCandlestick: any;
  gXaxis: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    private data: ChartDataService,
    private layout: ChartLayoutService,
    private axes: ChartAxesService,
    private scales:ChartScalesService,
    private popOverService: JzPopOversService)
  {
  }

  ngOnInit(): void {  }

  ngAfterViewInit() {
    this.popover_loading.show();
    const ticker = 'NVDA';
    this.stockPriceService.getStockPrices(ticker).subscribe(
      (data: StockPriceHistory[]) => {
        this.popover_loading.hide();
        this.data.stockPriceHistoryData = data;
        this.createChart();
      },
      (error) => {
        this.popover_loading.hide();
        this.popover_httperror.error = error.error;
        this.popover_httperror.headers = error.headers;
        this.popover_httperror.message = error.message;
        this.popover_httperror.name = error.name;
        this.popover_httperror.ok = error.ok;
        this.popover_httperror.status = error.status;
        this.popover_httperror.statusText = error.statusText;
        this.popover_httperror.url = error.url;
        this.popover_httperror.show();
        console.error("Error fetching stock prices:", error);
      }
    );
  }

  createChart(): void {
  
    //this.candlestick.plot.candlestick();
    this.sizeChartFramework();
    this.layout.createSections();
    this.data.scrubData();
  
    this.scales.createScales();
    this.axes.drawAxes();
    this.constructChart();
  }

  sizeChartFramework() {
    this.layout.svg = this.svgElementRef.nativeElement;
    this.layout.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.layout.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.layout.rectYaxisLeftA = this.yAxisGroupLeftRectARef.nativeElement;
    this.layout.rectYaxisRightA = this.yAxisGroupRightRectARef.nativeElement;
    this.layout.rectXaxisTopA = this.yAxisGroupLeftRectARef.nativeElement;
    this.layout.rectXaxisBottomA = this.yAxisGroupLeftRectARef.nativeElement;

    this.layout.rectCandlestick = this.rectCandlestickRef.nativeElement;

    this.layout.rectA = this.rectAref.nativeElement;
    this.layout.rectB = this.rectBref.nativeElement;
    this.layout.rectC = this.rectCref.nativeElement;

    this.axes.gXaxisGroupTop = this.xAxisGroupTopRectARef;
    this.axes.gXaxisGroupBottom = this.gXaxisGroupBottomRef;
    this.axes.gYaxisGroupLeft = this.gYaxisGroupLeftRef;
    this.axes.gYaxisGroupRight = this.yAxisGroupRightRectARef;
  }

  constructChart(): void {
    this.drawCandlestick();
  }

  drawCandlestick(): void {
    // Calculate the width of each candlestick
    const dataTimeIntervals = this.data.parsedData.map((d: any, i: number) => {
      if (i === 0) return 0; // No interval for the first data point
      return this.data.parsedData[i].date.getTime() - this.data.parsedData[i - 1].date.getTime();
    }).filter((interval: number) => interval > 0); // Remove the first zero interval

    const averageTimeInterval = dataTimeIntervals.reduce((a: any, b: any) => a + b, 0) / dataTimeIntervals.length;
    const timeDiff = this.data.parsedData.length > 1
      ? this.data.parsedData[1].date.getTime() - this.data.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds
    const candleWidth =
      this.scales.candlestickXscale(new Date(this.data.parsedData[0].date.getTime() + timeDiff)) - this.scales.candlestickXscale(this.data.parsedData[0].date);
    this.gCandlestick = select(this.gCandlestickRef.nativeElement)
      .attr("class", "candlestick")
      .attr("transform", `translate(${this.layout.sectionA.margins.left},${this.layout.sectionA.margins.top})`);
    const candlestick = new CandlestickChartComponent(this.gCandlestick);
    const plot = candlestick.plot.candlestick();
    plot.section = this.gCandlestick;
    plot.xScale(this.scales.candlestickXscale).yScale(this.scales.candlestickYscale);
    plot.draw(this.gCandlestick, this.data.stockPriceHistoryData, candleWidth, this.data.parsedData);
  }
}
