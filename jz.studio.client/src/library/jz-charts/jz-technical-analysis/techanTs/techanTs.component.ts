import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
/*import * as d3 from 'd3';*/
import { axisBottom, axisRight } from 'd3-axis';
import { scaleTime, scaleUtc, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { StockPriceHistory } from '../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../jz-pop-overs/jz-pop-overs.service';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
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

  //@ViewChild('sectionA', { static: true }) sectionA!: SVGGElement;
  //@ViewChild('sectionB', { static: true }) sectionB!: SVGGElement;
  //@ViewChild('sectionC', { static: true }) sectionC!: SVGGElement;
    
  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  sectionA: any;
  sectionB: any;
  sectionC: any;

  stockPriceHistoryData: StockPriceHistory[] = [];

  xScale!: any;
  yScale!: any;
  xAxis: any;
  yAxis: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
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
        this.popover_httperror.show();
        console.error("Error fetching stock prices:", error);
      }
    );
  }

  createChart(): void {
    this.svg = select('#svg');
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.sectionA = select('sectionA');
    this.sectionB = select('sectionB');
    this.sectionC = select('sectionC');

    this.xScale = scaleUtc().domain([new Date("2023-01-01"), new Date("2024-01-01")]).range([0, 800]);
    this.yScale = scaleLinear().domain([0, 100]).range([0, 400]);
    this.xAxis = axisBottom(this.xScale);
    this.yAxis = axisRight(this.yScale);

    this.svg.append('circle')
      .attr('cx', 300)
      .attr('cy', 200)
      .attr('r', 50)
      .style('fill', 'blue');

    //const candlestickPlot = this.techan.plot.candlestick().xScale(this.xScale).yScale(this.yScale);
    //this.svg.append("g").attr("class", "candlestick").call(candlestickPlot);
  }
}
