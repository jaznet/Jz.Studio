import { AfterViewInit, Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import * as d3 from 'd3';
//import  techan  from 'techan';
import { ScriptLoaderService } from '../jz-tech-chart/script-loader.service';

declare var techan: any;

@Component({
  selector: 'jz-tech-chart',
  templateUrl: './jz-tech-chart.component.html',
  styleUrls: ['./jz-tech-chart.component.css']
})
export class JzTechChartComponent implements OnInit,AfterViewInit {

  @HostBinding('class') classes = 'fit-to-parent';

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

  svgElement!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  ohlcSelection!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  parseDate: ((dateString: string) => Date | null) | ((arg0: any) => any) = d3.timeParse("%d-%b-%y");;

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

  techan: any;

  //#endregion

  constructor(private elementRef: ElementRef, private scriptLoader: ScriptLoaderService) { }

  ngOnInit() {  }

  ngAfterViewInit(): void {
    console.log('%c   jz=tech-chart', 'color:#B5A063');
     console.log('%c ngAfterViewInit technical-plot', 'color:#b5a063');
    //this.scriptLoader.loadScript('assets/techan/dist/techan.js')
    //  .then(() => {
    //    const techan = (window as any)['techan'];
    //  //  console.log('Techan.js loaded', window.techan);

    //    if (techan) {
    //      const chart = techan.plot.ohlc();
    //      console.log(chart);
          this.createPlot();
    //    } else {
    //      console.error('Techan is not defined.');
    //    }
    //  }).catch((err) => {
    //    console.error('Script loading failed.', err);
    //  });
  }

  createPlot() {
    this.width = this.elementRef.nativeElement.parentElement.clientWidth;
    this.height = this.elementRef.nativeElement.parentElement.clientHeight - 10;
    this.createPlotProperties();
    this.createSvgFramework();
    this.createTechnicalPlot();
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

  createSvgFramework() {
    console.log('%c    createSvgFramework', 'color:#B5A063');

    this.svgElement = d3.select('#svgContainer').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'svgElement');

    //console.log('%c  createSvgFramework', 'color:yellow', this.svgElement);

    //#region Definitions

    let defs = this.svgElement.append('defs');

    defs.append('clipPath')
      .attr('id', 'ohlcClip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.dimensions.plot.width)
      .attr('height', this.dimensions.ohlc.height + this.dimensions.ohlc.top);

    defs.append('clipPath')
      .attr('id', 'indicatorClip1')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.dimensions.plot.width)
      .attr('height', this.dimensions.indicator1.height + this.dimensions.indicator1.top);

    defs.append('clipPath')
      .attr('id', 'indicatorClip2')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.dimensions.plot.width)
      .attr('height', this.dimensions.indicator2.height + this.dimensions.indicator2.top);

    //#endregion

    this.svgElement
      .append('g')
      .attr('id', 'chartPlot')
      .attr('transform', 'translate(8,12)');

    this.svgElement.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + this.dimensions.margin.left + ',' + (this.dimensions.plot.height - 30) + ')');

    this.svgElement.append('text')
      .attr('class', 'symbol')
      .attr('x', 60)
      .attr('y', 20)
      .text('Facebook, Inc. (FB)');

    this.svgElement.append('g')
      .attr("class", "crosshair ohlc");
    this.svgElement.append('g')
      .attr("class", "crosshair macd");
    this.svgElement.append('g')
      .attr("class", "crosshair rsi")
      .attr("transform", "translate(" + this.dimensions.margin.left + ",0)");

    //#region ohlcSelection

    this.ohlcSelection = this.svgElement.append('g')
      .attr('class', 'ohlc')
      .attr('transform', 'translate(' + this.dimensions.margin.left + ',' + 0 + ')');

    this.ohlcSelection.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + (this.dimensions.width - this.dimensions.margin.left - this.dimensions.margin.right) + ',' + this.dimensions.ohlc.top + ')')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -11)
      .attr('dy', '.71em')
      //   .style('fill', '#44a2e5')
      .style('text-anchor', 'end')
      .text('Price ($)');

    this.ohlcSelection.append("g")
      .attr("class", "volume axis")
      .attr('transform', 'translate(' + (this.dimensions.plot.width - 40) + ',0)');

    this.ohlcSelection.append("g")
      .attr("class", "percent axis")
      .attr('transform', 'translate(' + '0' + ',' + this.dimensions.ohlc.top + ')');

    this.ohlcSelection.append("g")
      .attr("class", "candlestick");
    //  .attr("clip-path", "url(#ohlcClip)");

    this.ohlcSelection.append('g')
      .attr('class', 'close annotation up')
      .attr('transform', 'translate(' + 0 + ',0)');

    this.ohlcSelection.append("g")
      .attr("class", "volume");
    //  .attr("clip-path", "url(#ohlcClip)");

    this.ohlcSelection.append("g")
      .attr("class", "indicator sma ma-0")
      .attr("clip-path", "url(#ohlcClip)");

    this.ohlcSelection.append("g")
      .attr("class", "indicator sma ma-1")
      .attr("clip-path", "url(#ohlcClip)");

    this.ohlcSelection.append("g")
      .attr("class", "indicator ema ma-2")
      .attr("clip-path", "url(#ohlcClip)");

    //#endregion

    //#region macdSection

    this.macdSection = this.svgElement
      .append("g")
      .attr("class", "macd indicator")
      .attr('x', 0)
      .attr('y', this.dimensions.indicator1.top + this.dimensions.indicator1.padding)
      .attr("transform", "translate(" + this.dimensions.margin.left + ",0)");

    this.macdSection.append("g")
      .attr("class", "axis left")
      .attr("transform", "translate(" + "0" + ",0)");

    this.macdSection.append("g")
      .attr("class", "axis right")
      .attr("transform", "translate(" + this.dimensions.plot.width + ",0)");

    this.macdSection.append("g")
      .attr("class", "indicator-plot");

    //#endregion

    //#region RSI Section

    this.rsiSection = this.svgElement
      .append("g")
      .attr("class", "rsi indicator")
      .attr("transform", "translate(" + this.dimensions.margin.left + ",0)");

    this.rsiSection.append("g")
      .attr("class", "axis left");
    //  .attr("transform", "translate(" + this.x(0) + ",0)");

    this.rsiSection.append("g")
      .attr("class", "axis right")
      .attr("transform", "translate(" + this.dimensions.plot.width + ",0)");

    this.rsiSection.append("g")
      .attr("class", "indicator-plot");

    //#endregion

    this.svgElement.append("g")
      .attr("class", "trendlines analysis")
      .attr("clip-path", "url(#ohlcClip)");

    this.svgElement.append("g")
      .attr("class", "supstances analysis")
      .attr("clip-path", "url(#ohlcClip)");

    this.svgElement.append("g")
      .attr("class", "tradearrow")
      .attr("clip-path", "url(#ohlcClip)");
  }

  createTechnicalPlot() {
    console.log('%c    createTechnicalPlot', 'color:#b5a063');
  
    let that = this;

    d3.csv('/assets/csv/plot-data.csv')
      .then((data: any) => {
        //  console.log('%c   plot-data.csv', 'color:#fdffb2', data);
        let accessor = this.candlestickPlot.accessor(),
          indicatorPreRoll = 23;  // Don't show where indicators don't have data

        data = data.map(function (d: { Date: string; Open: string | number; High: string | number; Low: string | number; Close: string | number; Volume: string | number; }) {
          return {
            date: that.parseDate(d.Date),
            open: +d.Open,
            high: +d.High,
            low: +d.Low,
            close: +d.Close,
            volume: +d.Volume
          };
        }).sort(function (a: any, b: any) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        console.log('%c   data.csv', 'color:#b5a063', data);

        //  console.log('%c   data.csv', 'color:#b5a063', this.xScale);

        this.xScale.domain(this.techan.scale.plot.time(data).domain());
        this.yScale.domain(this.techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());
        this.yPercent.domain(this.techan.scale.plot.percent(this.yScale, accessor(data[indicatorPreRoll])).domain());
        this.yVolume.domain(this.techan.scale.plot.volume(data).domain());

        this.macdData = this.techan.indicator.macd()(data);
        this.macdScale.domain(this.techan.scale.plot.macd(this.macdData).domain());
        this.rsiData = this.techan.indicator.rsi()(data);
        this.rsiScale.domain(this.techan.scale.plot.rsi(this.rsiData).domain());

        //console.log('PLOT', this.candlestickPlot, this.volumePlot);
        this.svgElement.select("g.candlestick").datum(data).call(this.candlestickPlot);
        this.svgElement.select("g.close.annotation").datum([data[data.length - 1]]).call(this.closeAnnotation);
        this.svgElement.select("g.volume").datum(data).call(this.volumePlot);
        this.svgElement.select("g.sma.ma-0").datum(this.techan.indicator.sma().period(10)(data)).call(this.sma0Plot);
        this.svgElement.select("g.sma.ma-1").datum(this.techan.indicator.sma().period(20)(data)).call(this.sma1Plot);
        this.svgElement.select("g.ema.ma-2").datum(this.techan.indicator.ema().period(50)(data)).call(this.ema2Plot);
        ////console.log('PLOT1', this.macdData, this.macdPlot);
        this.svgElement.select("g.macd .indicator-plot").datum(this.macdData).call(this.macdPlot);
        this.svgElement.select("g.rsi .indicator-plot").datum(this.rsiData).call(this.rsiPlot);
        this.svgElement.select("g.crosshair.macd").call(this.macdCrosshairPlot);//.call(this.zoom);
        // this.svg.select("g.crosshair.rsi").call(this.rsiCrosshairPlot);//.call(this.zoom);
        //this.svg.select("g.crosshair.ohlc").call(this.ohlcCrosshairPlot);//.call(this.zoom);   // raises source Event error

        this.draw();

      })
      .catch((error: any) => {
        console.log('%cERROR:', 'color:red', error);
      });
  }

  draw() {
    console.log('%c   draw', 'color:#b5a063');
    this.svgElement.select("g.x.axis").call(this.xAxis);
    this.svgElement.select("g.ohlc .axis").call(this.yAxis);
    this.svgElement.select("g.volume.axis").call(this.volumeAxis);
    this.svgElement.select("g.percent.axis").call(this.percentAxis);
    this.svgElement.select("g.macd .axis.left").call(this.macdAxisLeft);
    this.svgElement.select("g.macd .axis.right").call(this.macdAxis);
    this.svgElement.select("g.rsi .axis.left").call(this.rsiAxisLeft);
    this.svgElement.select("g.rsi .axis.right").call(this.rsiAxis);

    //////// We know the data does not change, a simple refresh that does not perform data joins will suffice.
    this.svgElement.select("g.candlestick").call(this.candlestickPlot.refresh);
    this.svgElement.select("g.close.annotation").call(this.closeAnnotation.refresh);
    this.svgElement.select("g.volume").call(this.volumePlot.refresh);
    this.svgElement.select("g .sma.ma-0").call(this.sma0Plot.refresh);
    this.svgElement.select("g .sma.ma-1").call(this.sma1Plot.refresh);
    this.svgElement.select("g .ema.ma-2").call(this.ema2Plot.refresh);
    this.svgElement.select("g.macd .indicator-plot").call(this.macdPlot.refresh);
    this.svgElement.select("g.rsi .indicator-plot").call(this.rsiPlot.refresh);

    //this.svg.select("g.trendlines").call(this.trendline.refresh);
    //this.svg.select("g.supstances").call(this.supstance.refresh);
    //this.svg.select("g.tradearrow").call(this.tradearrow.refresh);

    //this.svg.select("g.crosshair.macd").call(this.macdCrosshairPlot.refresh);
    //this.svg.select("g.crosshair.rsi").call(this.rsiCrosshairPlot.refresh);
    //this.svg.select("g.crosshair.ohlc").call(this.ohlcAnnotationPlot.refresh);
  }

  zoomed() {
    //this.x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    //this.y.domain(d3.event.transform.rescaleY(yInit).domain());
    //yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain()); 
    //this.draw();
  }

}
