import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
import { StockPriceHistory } from '../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../jz-pop-overs/jz-pop-overs.service';
import { TechanTsService } from './techanTs.service';
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

  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  stockPriceHistoryData: StockPriceHistory[] = []
  xScale!: any;
  yScale!: any;

  private techan: any;
  private d3v4: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private stockPriceService: TechanTsService,
    private popOverService: JzPopOversService) { }

  ngOnInit(): void { }

  async ngAfterViewInit() {
    await this.initializeTechan();

    const ticker = 'NVDA';
    this.stockPriceService.getStockPrices(ticker).subscribe(
      (data: StockPriceHistory[]) => {
        this.stockPriceHistoryData = data;
        this.createChart();
      },
      (error) => {
        console.error("Error fetching stock prices:", error);
      }
    );
  }

  private async initializeTechan(): Promise<void> {
    if (!this.techan) {
      try {
        this.d3v4 = await import(/* webpackChunkName: "d3v4" */ 'd3-v4');
        const d3CommonJS = { ...this.d3v4, __esModule: false };  // Simulate CommonJS module

        const techanModule = await import(/* webpackChunkName: "techan" */ 'techan');
        this.techan = techanModule.default(d3CommonJS); // Initialize Techan with d3 v4

        console.log("Techan initialized successfully:", this.techan);
      } catch (error) {
        console.error("Failed to initialize Techan with D3:", error);
      }
    }
  }

  createChart(): void {
    this.svg = this.d3v4.select(this.svgElementRef.nativeElement);
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.xScale = this.d3v4.scaleUtc().domain([new Date("2023-01-01"), new Date("2024-01-01")]).range([0, 800]);
    this.yScale = this.d3v4.scaleLinear().domain([0, 100]).range([0, 400]);

    const candlestickPlot = this.techan.plot.candlestick().xScale(this.xScale).yScale(this.yScale);
    this.svg.append("g").attr("class", "candlestick").call(candlestickPlot);
  }
}
