import { AfterViewInit, Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import * as d3 from 'd3';
/*import { techan } from 'techan';*/

@Component({
  selector: 'jz-tech-chart',
  templateUrl: './jz-tech-chart.component.html',
  styleUrls: ['./jz-tech-chart.component.css']
})
export class JzTechChartComponent implements OnInit,AfterViewInit {

  @HostBinding('class') classes = 'fit-to-parent';

  techan: any;

  //#region Properties

  width: number = 300;
  height: number = 150;
  zoom: any;

  dimensions!: {
    width: number,
    height: number,
    margin: { top: number, right: number, bottom: number, left: number; },
    ohlc: { height: number, padding: number; top: number, bottom: number; },
    indicator1: { height: number, padding: number; top: number, bottom: number; },
    indicator2: { height: number, padding: number; top: number, bottom: number; },
    plot: { width: number, height: number; };
  };

  xScale: any;
  yScale: any;
  yPercent: any;
  yVolume: any;
  xAxis: any;
  yAxis: any;
  volumeAxis: any;
  percentAxis: any;

  macdSection: any;
  macdPlot: any;     // Moving Average Convergence Divergence
  macdData: any;
  macdScale: any;
  macdAxis: any;
  macdAxisLeft: any;

  rsiPlot: any;
  rsiData: any;
  rsiSection: any;
  rsiScale: any;
  rsiAxis: any;
  rsiAxisLeft: any;

  candlestickPlot: any;
  closeAnnotation: any;
  volumeAnnotationPlot: any;

  volumePlot: any;
  sma0Plot: any;
  sma1Plot: any;
  ema2Plot: any;

  timeAnnotationPlot: any;
  ohlcAnnotationPlot: any;
  macdAnnotationPlot: any;

  rsiAnnotationLeft: any;
  macdCrosshairPlot: any;
  macdAnnotationLeft: any;
  rsiAnnotationPlot: any;
  ohlcCrosshairPlot: any;
  rsiCrosshairPlot: any;
  percentAnnotationPlot: any;

  //#endregion

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    console.log('%c   techplot', 'color:#B5A063', this.elementRef.nativeElement.parentElement);
    // console.log('%c ngAfterViewInit technical-plot', 'color:#b5a063', this.svgElementContainer);
    this.width = this.elementRef.nativeElement.parentElement.clientWidth;
    this.height = this.elementRef.nativeElement.parentElement.clientHeight - 10;
    this.createPlotProperties();
    //this.createSvgFramework();
    //this.createTechnicalPlot();
  }

  createPlotProperties() {
    let that = this;
    let margins = { top: 8, right: 50, bottom: 0, left: 50 };
    let ohlcHeight = (this.height - 54) * .6;
    let ohlcSection = { top: margins.top, height: ohlcHeight, bottom: margins.top + ohlcHeight, padding: 0 };
    let padding = 4;
    let indicatorHeight = (this.height - 54) * .2;

    let indicator1 = {
      top: ohlcSection.bottom + padding,
      height: indicatorHeight,
      bottom: ohlcSection.bottom + padding + indicatorHeight,
      padding: 4
    };

    let indicator2 = {
      top: indicator1.bottom + padding,
      height: indicatorHeight,
      bottom: indicator1.bottom + padding + indicatorHeight,
      padding: 4
    };

    this.dimensions = {
      width: this.width,
      height: this.height,
      margin: margins,
      ohlc: ohlcSection,
      indicator1: indicator1,
      indicator2: indicator2,
      plot: {
        height: this.height - margins.top - margins.bottom,
        width: this.width - margins.left - margins.right
      }
    };
    console.log('%c    hostSize', 'color:#b5a063', this.width, this.height, this.dimensions);

    //#region Axes / Scales

    console.log('%c    createPlotProperties', 'color:#B5A063', this.dimensions);
    this.xScale = this.techan.scale.financetime().range([0, this.dimensions.plot.width]);
    this.yScale = d3.scaleLinear().range([this.dimensions.ohlc.height, 0]);
    // console.log('%c   x,y', 'color:#afb7aa', this.y);

    this.yPercent = this.yScale.copy();   // Same as y at this stage, will get a different domain later
    this.yVolume = d3.scaleLinear().range([this.yScale(0) + this.dimensions.ohlc.top, this.yScale(0.2)]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisRight(this.yScale);

    //const format = (n: number | { valueOf(): number; }): string => {
    //  const formatter = new Intl.NumberFormat('en-US', {
    //    notation: 'compact',
    //    compactDisplay: 'short',
    //    maximumSignificantDigits: 3,
    //  });

    //  return formatter.format(Number(n));
    //};



    this.volumeAxis = d3.axisRight(this.yVolume)
      .ticks(3)

      ;

    this.percentAxis = d3.axisLeft(this.yPercent);
     /* .tickFormat(d3.format("+.1%"));*/

    this.macdScale = d3.scaleLinear()
      .range([this.dimensions.indicator1.bottom, this.dimensions.indicator1.top]);
    this.macdAxisLeft = d3.axisLeft(this.macdScale).ticks(3);
    this.macdAxis = d3.axisRight(this.macdScale).ticks(3);

    this.rsiScale = this.macdScale.copy()
      .range([this.dimensions.indicator2.bottom, this.dimensions.indicator2.top]);

    this.rsiAxisLeft = d3.axisLeft(this.rsiScale)
      .ticks(3);
    this.rsiAxis = d3.axisRight(this.rsiScale)
      .ticks(3);

    //#endregion

    //#region Plots

    this.candlestickPlot = this.techan.plot.candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.closeAnnotation = this.techan.plot.axisannotation()
      .axis(this.yAxis)
      .orient('right')
      .accessor(this.candlestickPlot.accessor())
      .format(d3.format(',.2f'))
      .translate([this.dimensions.plot.width, 0]);

    this.volumeAnnotationPlot = this.techan.plot.axisannotation()
      .axis(this.volumeAxis)
      .orient("right")
      .width(35);

    this.volumePlot = this.techan.plot.volume()
      .accessor(this.techan.accessor.ohlc())   // Set the accessor to a ohlc accessor so we get highlighted bars
      .xScale(this.xScale)
      .yScale(this.yVolume);

    this.sma0Plot = this.techan.plot.sma()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.sma1Plot = this.techan.plot.sma()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.ema2Plot = this.techan.plot.ema()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.macdPlot = this.techan.plot.macd()
      .xScale(this.xScale)
      .yScale(this.macdScale);

    this.rsiPlot = this.techan.plot.rsi()
      .xScale(this.xScale)
      .yScale(this.rsiScale);

    this.timeAnnotationPlot = this.techan.plot.axisannotation()
      .axis(this.xAxis)
      .orient('bottom')
      .format(d3.timeFormat('%Y-%m-%d'))
      .width(65)
      .translate([0, this.dimensions.plot.height]);

    this.macdAnnotationPlot = this.techan.plot.axisannotation()
      .axis(this.macdAxis)
      .orient("right")
      .format(d3.format(',.2f'))
      .translate([this.xScale(1), 0]);

    this.macdAnnotationLeft = this.techan.plot.axisannotation()
      .axis(this.macdAxisLeft)
      .orient("left")
      .format(d3.format(',.2f'));

    this.rsiAnnotationPlot = this.techan.plot.axisannotation()
      .axis(this.rsiAxis)
      .orient("right")
      .format(d3.format(',.2f'))
      .translate([this.xScale(1), 0]);

    this.ohlcAnnotationPlot = this.techan.plot.axisannotation()
      .axis(this.yAxis)
      .orient('right')
      .format(d3.format(',.2f'))
      .translate([this.dimensions.margin.left, 0]);

    this.macdCrosshairPlot = this.techan.plot.crosshair()
      .xScale(this.timeAnnotationPlot.axis().scale())
      .yScale(this.macdAnnotationPlot.axis().scale())
      .xAnnotation(this.timeAnnotationPlot)
      .yAnnotation([this.macdAnnotationPlot, this.macdAnnotationLeft])
      .verticalWireRange([0, this.dimensions.plot.height]);

    this.rsiCrosshairPlot = this.techan.plot.crosshair()
      .xScale(this.timeAnnotationPlot.axis().scale())
      .yScale(this.rsiAnnotationPlot.axis().scale())
      .xAnnotation(this.timeAnnotationPlot)
      .yAnnotation([this.rsiAnnotationPlot, this.rsiAnnotationLeft])
      .verticalWireRange([0, this.dimensions.plot.height]);

    this.ohlcCrosshairPlot = this.techan.plot.crosshair()
      .xScale(this.timeAnnotationPlot.axis().scale())
      .yScale(this.ohlcAnnotationPlot.axis().scale())
      .xAnnotation(this.timeAnnotationPlot)
      .yAnnotation([this.ohlcAnnotationPlot, this.percentAnnotationPlot, this.volumeAnnotationPlot])
      .verticalWireRange([0, this.dimensions.plot.height]);

    //#endregion

    this.zoom = d3.zoom().on("zoom", this.zoomed);
    //this.trendlineData = [
    //    { start: { date: new Date(2014, 2, 11), value: 72.50 }, end: { date: new Date(2014, 5, 9), value: 63.34 } },
    //    { start: { date: new Date(2013, 10, 21), value: 43 }, end: { date: new Date(2014, 2, 17), value: 70.50 } }
    //];

    //this.supstanceData = [
    //    { start: new Date(2014, 2, 11), end: new Date(2014, 5, 9), value: 63.64 },
    //    { start: new Date(2013, 10, 21), end: new Date(2014, 2, 17), value: 55.50 }
    //];

    //this.trendline = this.techan.plot.trendline()
    //    .xScale(this.xScale)
    //    .yScale(this.yScale);

    //this.supstance = this.techan.plot.supstance()
    //    .xScale(this.xScale)
    //    .yScale(this.yScale);

    //this.tradearrow = this.techan.plot.tradearrow()
    //    .xScale(this.xScale)
    //    .yScale(this.yScale)
    //    .y(function (d) {
    //        // Display the buy and sell arrows a bit above and below the price, so the price is still visible
    //        if (d.type === 'buy') return that.yScale(d.low) + 5;
    //        if (d.type === 'sell') return that.yScale(d.high) - 5;
    //        else return this.y(d.price);
    //    });
  }

  zoomed() {
    //this.x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    //this.y.domain(d3.event.transform.rescaleY(yInit).domain());
    //yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain()); 
    //this.draw();
  }

}
