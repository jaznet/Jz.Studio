import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
/*import * as d3 from 'd3';*/
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select, selection, selectAll } from 'd3-selection';
import { max, min, extent } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { CandlestickData, SectionAttributes } from '../interfaces/techan-interfaces';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
/*import { TechanLibService } from '../services/techan-lib.service';*/
import { JzPopOversService } from '../../../../jz-pop-overs/jz-pop-overs.service';
import { CandlestickChartComponent } from '../charts/candlestick-chart/candlestick-chart.component';

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

  @ViewChild('sectionA', { static: true }) gSectionAref!: ElementRef<SVGGElement>;
  @ViewChild('rectA', { static: true }) rectAref!: ElementRef<SVGRectElement>;
  @ViewChild('rectYaxis', { static: true }) rectYaxisRef!: ElementRef<SVGRectElement>;
  @ViewChild('rectCandlestick', { static: true }) rectCandlestickRef!: ElementRef<SVGRectElement>;
  @ViewChild('candlestick', { static: true }) gCandlestickRef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisGroup', { static: true }) gXaxisGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisGroup', { static: true }) gYaxisGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('sectionB', { static: true }) gSectionBref!: ElementRef<SVGGElement>;
  @ViewChild('sectionC', { static: true }) gSectionCref!: ElementRef<SVGGElement>;

  @ViewChild('rectB', { static: true }) rectBref!: ElementRef<SVGRectElement>;
  @ViewChild('rectC', { static: true }) rectCref!: ElementRef<SVGRectElement>;
  
  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  sectionA: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 32, bottom: 20, left: 32 } };
  rectYaxis: any;
  rectCandlestick: any;

  sectionB: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 30, bottom: 20, left: 30 } };
  sectionC: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 30, bottom: 20, left: 30 } };

  gSectionA: any;
  gSectionB: any;
  gSectionC: any;

  parsedData: any;

  gCandlestick: any;
  gXaxis: any;
  gXaxisGroupTop: any;
  gXaxisGroupBottom: any;
  gYaxisGroup: any;

  stockPriceHistoryData: StockPriceHistory[] = [];

/*  candlestick!: CandlestickChartComponent;*/
  candlestickXscale!: any;
  candlestickYscale!: any;
  candlestickXaxis: any;
  candlestickYaxis: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
  /*  private techanLibService: TechanLibService,*/
    private popOverService: JzPopOversService)
  {
 /*   this.candlestick = new CandlestickChartComponent();*/
  }

  ngOnInit(): void {
 /*   this.candlestick = new CandlestickChartComponent();*/
  }

  ngAfterViewInit() {
  
    this.popover_loading.show();
    const ticker = 'NVDA';
    this.stockPriceService.getStockPrices(ticker).subscribe(
      (data: StockPriceHistory[]) => {
        this.popover_loading.hide();
        this.stockPriceHistoryData = data;
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
    this.createSections();
    this.scrubData();
    this.setAxes();
    this.constructChart();
  }

  sizeChartFramework() {
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;
    this.rectYaxis = this.rectYaxisRef.nativeElement;
    this.rectCandlestick = this.rectCandlestickRef.nativeElement;
  }

  createSections(): void {
    // SECTION A
    let bbox = this.rectAref.nativeElement.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    //this.rectCandlestick.width = this.svgWidth;
    //this.rectCandlestick.height = this.svgHeight*.5;
    this.rectYaxis.setAttribute('x',-this.sectionA.margins.left);
    this.rectYaxis.setAttribute('width', this.sectionA.margins.left);
    this.rectYaxis.setAttribute('height', this.sectionA.height-this.sectionA.margins.bottom);
    this.rectCandlestick.setAttribute('width', this.svgWidth-this.sectionA.margins.left-this.sectionA.margins.right);
    this.rectCandlestick.setAttribute('height', (this.svgHeight * .5) - this.sectionA.margins.top -this.sectionA.margins.bottom);

    // SECTION B
    bbox = this.rectBref.nativeElement.getBBox();
    this.sectionB.width = bbox.width;
    this.sectionB.height = bbox.height;

    // SECTION C
    bbox = this.rectCref.nativeElement.getBBox();
    this.sectionC.width = bbox.width;
    this.sectionC.height = bbox.height;
  }

  scrubData(): void {
    const priceValues = this.stockPriceHistoryData.map(d => [d.open, d.high, d.low, d.close]).flat();
    const minPrice = min(priceValues);
    const maxPrice = max(priceValues);

    // Assuming data is an array of objects with a 'date' property as a string
    this.parsedData = this.stockPriceHistoryData.map(d => ({
      ...d,
      date: new Date(d.date) // Convert date string to Date object
    }));
    this.parsedData = this.parsedData.filter((d: { date: { getTime: () => number; }; }) => !isNaN(d.date.getTime()));
    console.log('Parsed Data:', this.parsedData.map((d: { date: { getTime: () => number; }; }) => ({ date: d.date, isValid: !isNaN(d.date.getTime()) })));

    const dateExtent = extent(this.parsedData, (d: CandlestickData) => {
        return d.date;
    });

    console.log('Date Extent:', dateExtent);

    if (dateExtent[0] && dateExtent[1]) {
      this.candlestickXscale = scaleTime()
        .domain(dateExtent)
        .range([0, this.sectionA.width-this.sectionA.margins.left-this.sectionA.margins.right]);
    } else {
      // Handle the case where extent is undefined, e.g., set a default domain
      this.candlestickXscale = scaleTime()
        .domain([new Date(), new Date()]) // Default to current date
        .range([0, this.sectionA.width - this.sectionA.margins.left - this.sectionA.margins.right]);
    }

    console.log('xScale Domain:', this.candlestickXscale.domain());
    console.log('xScale Range:', this.candlestickXscale.range());

    this.candlestickYscale = scaleLinear()
      .domain([minPrice ?? 0, maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom, 0]); // Invert the range for correct orientation (top to bottom)
  }

  setAxes(): void {
    this.candlestickYaxis = axisLeft(this.candlestickYscale);
  }

  constructChart(): void {
    this.drawCandlestick();
    this.drawAxes();
  }

  drawCandlestick(): void {
    // Calculate the width of each candlestick
    const dataTimeIntervals = this.parsedData.map((d: any, i: number) => {
      if (i === 0) return 0; // No interval for the first data point
      return this.parsedData[i].date.getTime() - this.parsedData[i - 1].date.getTime();
    }).filter((interval: number) => interval > 0); // Remove the first zero interval

    const averageTimeInterval = dataTimeIntervals.reduce((a: any, b: any) => a + b, 0) / dataTimeIntervals.length;
    const timeDiff = this.parsedData.length > 1
      ? this.parsedData[1].date.getTime() - this.parsedData[0].date.getTime()
      : 24 * 60 * 60 * 1000; // Default to one day in milliseconds
    const candleWidth =
      this.candlestickXscale(new Date(this.parsedData[0].date.getTime() + timeDiff)) - this.candlestickXscale(this.parsedData[0].date);
    this.gCandlestick = select(this.gCandlestickRef.nativeElement)
      .attr("class", "candlestick")
      .attr("transform", `translate(${this.sectionA.margins.left},${this.sectionA.margins.top})`);
    const candlestick = new CandlestickChartComponent(this.gCandlestick);
    const plot = candlestick.plot.candlestick();
    plot.section = this.gCandlestick;
    plot.xScale(this.candlestickXscale).yScale(this.candlestickYscale);
    plot.draw(this.gCandlestick, this.stockPriceHistoryData, candleWidth, this.parsedData);

    console.log(candlestick);
    console.log(this.stockPriceHistoryData);

    console.log('Tick Values:', this.candlestickXscale.ticks());
    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'
    this.candlestickXaxis = axisBottom(this.candlestickXscale)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date))

    this.gSectionA = select(this.gSectionAref.nativeElement);
  }

  drawAxes(): void {
    this.gXaxisGroupBottom = select(this.gXaxisGroupRef.nativeElement)
      .attr('transform', `translate(${this.sectionA.margins.left},${this.sectionA.height - this.sectionA.margins.bottom})`);
    this.gXaxisGroupBottom.call(this.candlestickXaxis);

    this.gYaxisGroup = select(this.gYaxisGroupRef.nativeElement)
      .attr('transform', `translate(${this.sectionA.margins.left},${this.sectionA.margins.top})`);
    this.gYaxisGroup.call(this.candlestickYaxis);
  }

}
