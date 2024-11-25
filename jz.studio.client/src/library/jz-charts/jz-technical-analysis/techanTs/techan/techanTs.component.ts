import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
/*import * as d3 from 'd3';*/
import { axisBottom, axisRight } from 'd3-axis';
import { scaleTime, scaleUtc, scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { SvgElementAttributes } from '../interfaces/techan-interfaces';
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
  @ViewChild('svgrect', { static: true }) svgRectElementRef!: ElementRef;
  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopOverLoadingComponent;

  @ViewChild('sectionA', { static: true }) gSectionAref!: ElementRef<SVGGElement>;
  @ViewChild('sectionB', { static: true }) gSectionBref!: ElementRef<SVGGElement>;
  @ViewChild('sectionC', { static: true }) gSectionCref!: ElementRef<SVGGElement>;

  @ViewChild('rectA', { static: true }) rectAref!: ElementRef<SVGRectElement>;
  @ViewChild('rectB', { static: true }) rectBref!: ElementRef<SVGRectElement>;
  @ViewChild('rectC', { static: true }) rectCref!: ElementRef<SVGRectElement>;
    
  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  sectionA: SvgElementAttributes = { x: 0, y: 0, width: 0, height: 0 };
  sectionB: SvgElementAttributes = { x: 0, y: 0, width: 0, height: 0 };
  sectionC: SvgElementAttributes = { x: 0, y: 0, width: 0, height: 0 };

  stockPriceHistoryData: StockPriceHistory[] = [];

  xScale!: any;
  yScale!: any;
  xAxis: any;
  yAxis: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    private techanLibService: TechanLibService,
    private popOverService: JzPopOversService) { }

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
        this.popover_httperror.error = error.headers;
        this.popover_httperror.error = error.message;
        this.popover_httperror.error = error.name;
        this.popover_httperror.error = error.ok;
        this.popover_httperror.error = error.status;
        this.popover_httperror.error = error.statusText;
        this.popover_httperror.error = error.url;
        this.popover_httperror.show();
        console.error("Error fetching stock prices:", error);
      }
    );
  }

  createChart(): void {
    this.svg = select('#svg');
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    let bbox = this.rectAref.nativeElement.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    bbox = this.rectBref.nativeElement.getBBox();
    this.sectionB.width = bbox.width;
    this.sectionB.height = bbox.height;
    bbox = this.rectCref.nativeElement.getBBox();
    this.sectionC.width = bbox.width;
    this.sectionC.height = bbox.height;

    this.xScale = scaleBand<Date>()
      .domain(this.stockPriceHistoryData.map(d => d.date))
      .range([0, this.sectionA.width]) 
      .padding(0.1); // Optional: add padding between bands

    this.yScale = scaleLinear().domain([0, 100]).range([0, this.sectionA.height]);
    this.xAxis = axisBottom(this.xScale);
    this.yAxis = axisRight(this.yScale);

    const gSectionA = select(this.gSectionAref.nativeElement);
      //.append("g")
      //.attr("class", "candlestick")
      //.attr("transform", "translate(0,-400)");

    const candlestickPlot = this.techanLibService.plot.candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);
   
    candlestickPlot.draw(gSectionA, this.stockPriceHistoryData);

    // Append a new <g> element to `gSectionA` specifically for the x-axis
    const xAxisGroup = gSectionA
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.sectionA.height})`); // Translate to bottom of Section A

    // Call the xAxis generator to create the axis
    xAxisGroup.call(this.xAxis);

  }
}
