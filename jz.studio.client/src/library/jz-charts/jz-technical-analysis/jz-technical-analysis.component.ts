import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
import { JzTechnicalAnalysisService } from './jz-technical-analysis.service';
import { StockPriceHistory } from '../../../models/stock-price-history.model';
import { PopOverLoadingComponent } from '../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { PopoverHttpErrorComponent } from '../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { JzPopOversService } from '../../jz-pop-overs/jz-pop-overs.service';
import { DxPopoverComponent } from 'devextreme-angular';

export interface range {
  start: number;
  end: number;
}

@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svgElementRef!: ElementRef;
  @ViewChild('svgrect', { static: true }) svgRectElementRef!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionA!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionB!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionC!: ElementRef;
  @ViewChild('rectA', { static: true }) rectA!: ElementRef;
  @ViewChild('rectB', { static: true }) rectB!: ElementRef;
  @ViewChild('rectC', { static: true }) rectC!: ElementRef;

  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: false }) popover_loading!: PopOverLoadingComponent;

  svg!: d3.Selection<any, unknown, null, undefined>;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  svgChart: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number; };
    ohlc: { height: number; padding: number; top: number; bottom: number; };
    indicator1: { height: number; padding: number; top: number; bottom: number; };
    indicator2: { height: number; padding: number; top: number; bottom: number; };
    plotArea: { width: number; height: number; };
    sections: { A: range; B: range; C: range }
  } = {
      width: 800, // Default width, adjust as necessary
      height: 600, // Default height, adjust as necessary 
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      ohlc: { height: 300, padding: 10, top: 20, bottom: 20 },
      indicator1: { height: 100, padding: 5, top: 330, bottom: 20 },
      indicator2: { height: 100, padding: 5, top: 455, bottom: 20 },
      plotArea: { width: 760, height: 540 }, // This will be recalculated in `ngAfterViewInit`
      sections: { A: { start: 1, end: 100 }, B: { start: 101, end: 200 }, C: { start: 201, end: 300 } }
    };

  stockPriceHistoryData: StockPriceHistory[] = []
  candlestickPlot: any;
  xScale!: any;
  yScale!: any;

  private techan: any;  // Store techan instance here
  private d3v4: any;
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: JzTechnicalAnalysisService,
    private popOverService: JzPopOversService) { }

  ngOnInit(): void { }

 async  ngAfterViewInit() {
   await this.initializeTechan();

    const ticker = 'NVDA';  // You can change this dynamically as needed
  
    this.popover_loading.show();
    this.stockPriceService.getStockPrices(ticker).subscribe( 
      (data: StockPriceHistory[]) => {
        this.stockPriceHistoryData = data;
        this.createChart();
        this.popover_loading.hide();
      },
      (error) => {
        this.popover_httperror.show();
      }
    );
  }

  private async initializeTechan(): Promise<void> {
    if (!this.techan) {
      this.d3v4 = await import(/* webpackChunkName: "d3v4" */ 'd3-v4');
      const techanModule = await import(/* webpackChunkName: "techan" */ 'techan');

      if (this.d3v4?.min) {
        this.techan = techanModule.default(this.d3v4); // Initialize Techan with d3 v4
      } else {
        console.error("D3 v4 did not load correctly.");
      }
    }
  }

  //private async initializeTechan(): Promise<void> {
  //  if (!this.techan) {
  //    this.d3v4 = await import(/* webpackChunkName: "d3v4" */ 'd3-v4');
  //    const techanModule = await import(/* webpackChunkName: "techan" */ 'techan');

  //    if (this.d3v4?.min) {
  //      this.techan = techanModule.default(this.d3v4); // Initialize Techan with d3 v4
  //    } else {
  //      console.error("D3 v4 did not load correctly.");
  //    }
  //  }
  //}

  createChart(): void {
    this.createtChartLayoutISettings();
    this.createSections();
    this.createAxes();
 //  this.plotData();
  }

  createtChartLayoutISettings() {
    this.svg =this. d3v4.select(this.svgElementRef.nativeElement);
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.svgRect = this.d3v4.select("#plotArea");
    const rectNode = this.svgRect.node(); // Get the actual DOM element
    if (rectNode) {
      const rectDimensions = rectNode.getBoundingClientRect();
      this.svgRectWidth = rectDimensions.width;
      this.svgRectHeight = rectDimensions.height;
    }

    const rangeA: range = { start: 0, end:( this.svgRectHeight * .5)-11 };
    const rangeB: range = { start: this.svgRectHeight * .5, end: (this.svgRectHeight * .75)-1 };
    const rangeC: range = { start: .75, end: this.svgRectHeight };

    this.svgChart.sections = { A: rangeA, B: rangeB, C: rangeC };

    this.svgChart.margins = { top: 36, right: 36, bottom: 36, left: 36 };
    this.svgChart.plotArea.width = this.svgWidth - this.svgChart.margins.left - this.svgChart.margins.right;
    this.svgChart.plotArea.height = this.svgHeight - this.svgChart.margins.top - this.svgChart.margins.bottom;

    console.log(this.svgChart)
  }

  createSections() {
 //   this.rectC.nativeElement.setAttribute('width', this.svgWidth);
  }

  createAxes() {
    // Declare the x (horizontal position) scale.
    // xAxis
    const xAxis = this.d3v4.scaleUtc()
      .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .range([0, this.svgChart.plotArea.width]);

    this.svg.append("g")
      .attr("transform", `translate(
        ${this.svgChart.margins.top},
        ${this.svgHeight  - 36})`)
      .call(this.d3v4.axisBottom(xAxis));

    // yAxis
    const yAxis = this.d3v4.scaleLinear().range([0,this.svgChart.sections.A.end]);

    this.svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(32,0)`)
      .call(this.d3v4.axisLeft(yAxis));
  }
  
  plotData() {
    // Use d3@4.2.6 to avoid compatibility issues with techan
    this.svg = this.d3v4.select(this.svgElementRef.nativeElement);
    this.xScale = this.d3v4.scaleUtc().domain([new Date("2023-01-01"), new Date("2024-01-01")]).range([0, 800]);
    this.yScale = this.d3v4.scaleLinear().domain([0, 100]).range([0, 400]);

   // const techanInstance = techan(d3);
    const candlestickPlot = this.techan.plot.candlestick().xScale(this.xScale).yScale(this.yScale);
  }

  transformData(stockPriceHistoryData: StockPriceHistory[]): any[] {
    // Define the accessor and pre-roll variables if needed
    let accessor = this.candlestickPlot.accessor();
    let indicatorPreRoll = 23; // Adjust this as needed
    
    // Transform the StockPriceHistory array
    const transformedData = stockPriceHistoryData.map(d => ({
      date: new Date(d.timestamp), // Use timestamp or date depending on your requirement
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    }))
      .sort((a, b) => this.d3v4.ascending(accessor.d(a), accessor.d(b)));

    return transformedData;
  }
}
