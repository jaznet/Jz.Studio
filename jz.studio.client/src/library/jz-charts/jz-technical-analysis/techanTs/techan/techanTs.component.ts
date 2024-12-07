import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
/*import * as d3 from 'd3';*/
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { max, min } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { SectionAttributes } from '../interfaces/techan-interfaces';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { TechanLibService } from '../services/techan-lib.service';
import { JzPopOversService } from '../../../../jz-pop-overs/jz-pop-overs.service';
export interface range {
  start: number;
  end: number;
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

  gCandlestick: any;
  gXaxis: any;
  gXaxisGroupTop: any;
  gXaxisGroupBottom: any;
  gYaxisGroup: any;

  stockPriceHistoryData: StockPriceHistory[] = [];

  xScale!: any;
  yScale!: any;
  xAxis: any;
  yAxis: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    private techanLibService: TechanLibService,
    private popOverService: JzPopOversService)
  { }

  ngOnInit(): void { }

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
    this.sizeChartFramework();
    this.createSections();
    this.setScales();
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
    this.rectCandlestick.setAttribute('height',( this.svgHeight*.5)-this.sectionA.margins.bottom);

    // SECTION B
    bbox = this.rectBref.nativeElement.getBBox();
    this.sectionB.width = bbox.width;
    this.sectionB.height = bbox.height;

    // SECTION C
    bbox = this.rectCref.nativeElement.getBBox();
    this.sectionC.width = bbox.width;
    this.sectionC.height = bbox.height;
  }

  setScales(): void {
    const priceValues = this.stockPriceHistoryData.map(d => [d.open, d.high, d.low, d.close]).flat();
    const minPrice = min(priceValues);
    const maxPrice = max(priceValues);

    this.yScale = scaleLinear()
      .domain([minPrice ?? 0, maxPrice ?? 100]) // Using minPrice and maxPrice to define the domain
      .range([this.sectionA.height - this.sectionA.margins.bottom, 0]); // Invert the range for correct orientation (top to bottom)
  }

  setAxes(): void {
    this.yAxis = axisLeft(this.yScale);
  }

  constructChart(): void {
    this.drawCandlestick();
    this.drawAxes();
  }

  drawCandlestick(): void {
    console.log(this.stockPriceHistoryData);
    this.xScale = scaleBand<Date>()
      .domain(this.stockPriceHistoryData.map(d => d.date))
      .range([0, this.sectionA.width - this.sectionA.margins.left-this.sectionA.margins.right])
      .padding(0.1); // Adjust as needed to fit bars comfortably

    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'
    this.xAxis = axisBottom(this.xScale)
      .tickValues(this.xScale.domain().filter((d:Date, i:number) => i % 5 === 0)) // Show every 5th date
      .tickFormat(d => dateFormatter(d as Date)); // Cast 'd' to Date explicitly

    this.gSectionA = select(this.gSectionAref.nativeElement);



    this.gCandlestick = select(this.gCandlestickRef.nativeElement)
      .attr("class", "candlestick")
      .attr("transform", `translate(${this.sectionA.margins.left}, 0)`);

    const candlestickPlot = this.techanLibService.plot.candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);

    candlestickPlot.draw(this.gCandlestick, this.stockPriceHistoryData);
  }

  drawAxes(): void {
    this.gXaxisGroupBottom = select(this.gXaxisGroupRef.nativeElement)
      .attr('transform', `translate(${this.sectionA.margins.left},${this.sectionA.height - this.sectionA.margins.bottom})`);
    this.gXaxisGroupBottom.call(this.xAxis);

    this.gYaxisGroup = select(this.gYaxisGroupRef.nativeElement)
      .attr('transform', `translate(${this.sectionA.margins.left},0)`);
    this.gYaxisGroup.call(this.yAxis);
  }

}
