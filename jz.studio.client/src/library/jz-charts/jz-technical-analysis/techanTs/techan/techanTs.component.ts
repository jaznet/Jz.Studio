
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { range } from 'rxjs';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { TechanTsService } from './techanTs.service';
import { PopoverHttpErrorComponent } from '../../../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../../../jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { olhcData, SectionAttributes } from '../interfaces/techan-interfaces';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { JzPopOversService } from '../../../../jz-pop-overs/jz-pop-overs.service';
import { ChartDataService } from '../services/chart-data.service';
import { ChartLayoutService } from '../services/chart-layout.service';
import { ChartAxesService } from '../services/chart-axes.service';
import { ChartScalesService } from '../services/chart-scales.service';
import { select, selection, selectAll } from 'd3-selection';
import { VolumeChartService } from '../services/charts/volume-chart.service';
import { CandlestickChartService } from '../services/charts/candlestick-chart.service';
import { SmaChartService } from '../services/charts/sma-chart.service';
import { MacdChartService } from '../services/charts/macd-chart.service';
CandlestickChartService
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

  @ViewChild('xAxisGroupBottom', { static: true }) gXaxisGroupBottomRef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisGroupLeft', { static: true }) gYaxisGroupLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('sectionA', { static: true }) gSectionAref!: ElementRef<SVGGElement>;
  // BODY
  @ViewChild('sectionAcontent', { static: true }) sectionAcontentRef!: ElementRef<SVGGElement>;
  @ViewChild('sectionAcontentRect', { static: true }) sectionAcontentRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('volumeGroup', { static: true }) volumeGroupRef!: ElementRef<SVGGElement>;

  @ViewChild('sectionB', { static: true }) gSectionBref!: ElementRef<SVGGElement>;
  @ViewChild('sectionC', { static: true }) gSectionCref!: ElementRef<SVGGElement>;

  @ViewChild('rectA', { static: true }) rectAref!: ElementRef<SVGRectElement>;
  @ViewChild('rectB', { static: true }) rectBref!: ElementRef<SVGRectElement>;
  @ViewChild('rectC', { static: true }) rectCref!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisTopGroupA', { static: true }) xAxisTopGroupARef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopA', { static: true }) xAxisTopARef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisTopRectA', { static: true }) xAxisTopRectARef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisRightGroupA', { static: true }) yAxisRightGroupARef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightA', { static: true }) yAxisRightARef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisRightRectA', { static: true }) yAxisRightRectARef!: ElementRef<SVGRectElement>;

  @ViewChild('xAxisBottomA', { static: true }) xAxisBottomARef!: ElementRef<SVGGElement>;
  @ViewChild('xAxisBottomRectA', { static: true }) xAxisBottomRectARef!: ElementRef<SVGRectElement>;

  @ViewChild('yAxisLeftGroupA', { static: true }) yAxisLeftGroupARef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftA', { static: true }) yAxisLeftARef!: ElementRef<SVGGElement>;
  @ViewChild('yAxisLeftRectA', { static: true }) yAxisLeftRectARef!: ElementRef<SVGRectElement>;

  // CANDLESTICK
  @ViewChild('rectCandlestick', { static: true }) rectCandlestickRef!: ElementRef<SVGRectElement>;
  @ViewChild('candlestick', { static: true }) gCandlestickRef!: ElementRef<SVGGElement>;

  // VOLUME GROUP
  @ViewChild('volumeRect', { static: true }) volumeRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('volumeChart', { static: true }) volumeChartRef!: ElementRef<SVGGElement>;

  @ViewChild('sma1', { static: true }) sma1Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma2', { static: true }) sma2Ref!: ElementRef<SVGGElement>;
  @ViewChild('sma3', { static: true }) sma3Ref!: ElementRef<SVGGElement>;

  // MACD GROUP
  @ViewChild('macdChart', { static: true }) macdChartRef!: ElementRef<SVGGElement>;

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
    private popOverService: JzPopOversService,
    private candlestickChart: CandlestickChartService,
    private volumeChart: VolumeChartService,
    private smaChart: SmaChartService,
    private macdChart: MacdChartService
   )  { }

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
    this.createChartFramework();
    this.layout.createSections();
    this.data.scrubData();
    this.scales.createScales();
    this.scales.createMacdYScale(this.data.macdData, this.layout.rectB.height.baseVal.value);
    this.axes.drawAxes();
    this.constructChart();
  }

  createChartFramework() {
    this.layout.svg = this.svgElementRef.nativeElement;
    this.layout.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.layout.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.layout.sectionA = this.gSectionAref.nativeElement;
    this.layout.sectionAcontent = this.sectionAcontentRef.nativeElement;
    this.layout.sectionAcontentRect = this.sectionAcontentRectRef.nativeElement;
    this.layout.sectionAvolume = this.volumeGroupRef.nativeElement;
    this.layout.sma1 = this.sma1Ref.nativeElement;
    this.layout.sma2 = this.sma2Ref.nativeElement;
    this.layout.sma3 = this.sma3Ref.nativeElement;
    this.layout.macdChart = this.macdChartRef.nativeElement;
    
    this.layout.xAxisTopA = this.xAxisTopARef.nativeElement;
    this.layout.xAxisTopGroupA = this.xAxisTopGroupARef.nativeElement;
    this.layout.xAxisTopRectA = this.xAxisTopRectARef.nativeElement;

    this.layout.yAxisRightA = this.yAxisRightARef.nativeElement;
    this.layout.yAxisRightGroupA = this.yAxisRightGroupARef.nativeElement;
    this.layout.yAxisRightRectA = this.yAxisRightRectARef.nativeElement;

    this.layout.yAxisLeftA = this.yAxisLeftARef.nativeElement;
    this.layout.yAxisLeftGroupA = this.yAxisLeftGroupARef.nativeElement;;
    this.layout.yAxisLeftRectA = this.yAxisLeftRectARef.nativeElement;

    this.layout.xAxisBottomA = this.xAxisBottomARef.nativeElement;
    this.layout.xAxisBottomRectA = this.xAxisBottomRectARef.nativeElement;

    this.layout.rectCandlestick = this.rectCandlestickRef.nativeElement;
    this.layout.rectVolume = this.volumeRectRef.nativeElement;;

    this.layout.rectA = this.rectAref.nativeElement;
    this.layout.rectB = this.rectBref.nativeElement;
    this.layout.rectC = this.rectCref.nativeElement;

    this.axes.xAxisTop = this.xAxisTopARef;
    this.axes.yAxisRight = this.yAxisRightARef;
    this.axes.xAxisBottom = this.xAxisBottomARef;
    this.axes.yAxisLeft = this.yAxisLeftARef;

    this.candlestickChart.gCandlestick = this.gCandlestickRef;

  /*  this.volumeChart.*/
  }

  constructChart(): void {
    this.drawCandlestick();
    this.drawVolume();
    this.drawSma1(5);
    this.drawSma2(50);
    this.drawSma3(100);
    this.drawMacd();
  }

  drawCandlestick(): void {
    this.candlestickChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.candlestickYscale)
      .setTargetGroup(this.gCandlestickRef.nativeElement)
      .setCandleWidth()
      .draw();
  }

  drawVolume(): void {
    this.volumeChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.volumeYscale)
      .setTargetGroup(this.volumeGroupRef.nativeElement)
      .setBarWidth()
      .draw();
  }

  drawSma1(period:number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.candlestickYscale)
      .setTargetGroup(this.layout.sma1) // Specify target group
      .setRollingPeriod(period)
      .setColor('#4E59D0')
      .draw();
  }

  drawSma2(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.candlestickYscale)
      .setTargetGroup(this.layout.sma2) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#F1FEC6')
      .draw();
  }

  drawSma3(period: number): void {
    this.smaChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.candlestickYscale)
      .setTargetGroup(this.layout.sma3) // Specify target group
      .setRollingPeriod(period) // Set desired SMA window size
      .setColor('#ff3a20')
      .draw();
  }

  drawMacd():void {
    this.macdChart
      .xScale(this.scales.dateScaleX)
      .yScale(this.scales.macdYscale)
      .setTargetGroup(this.layout.macdChart)
      .setPeriods(12, 26, 9) // Typical MACD periods
      .draw();

  }

}
