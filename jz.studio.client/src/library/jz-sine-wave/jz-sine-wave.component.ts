
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'jz-sine-wave',
  templateUrl: './jz-sine-wave.component.html',
  styleUrls: ['./jz-sine-wave.component.css']
})
export class JzSineWaveComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('plotSvgContainer', { static: false }) plotSvgContainer!: ElementRef;

  //#region properties
  readonly x = 0;
  height = 400; width = 600; margin = 12;
  graphHeight = 0; graphWidth = 0;
  unitCircleRadius = 100;

  xScale!: (arg0: number) => any;
  yScale!: (arg0: number) => any;
  xAxisScale!: any;
  yAxisScale!: any;
  initialX!: number;
  initialY!: string;
  yAxisXCoord!:  number;

  svg_ElementContainer!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  g_graphContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  g_UnitCircleContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  g_SineWaveContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  axisDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  dot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  verticalDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  hypotenuse!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  opposite!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  adjacent!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  joiningLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  time: number = 0;
  xIncrement: number = 0;
  plotCreated: boolean = false;
  //#endregion

  constructor() { }

  ngAfterViewInit(): void {
    console.log('%cplot', 'color:orange', this.initialX, this.initialY);

    this.width = this.plotSvgContainer.nativeElement.parentElement.clientWidth;
    this.height = this.plotSvgContainer.nativeElement.parentElement.clientHeight;
    this.createPlot();

    // Access MathJax here
    // Call the typesetClear function to clear any existing typesetting
    //MathJax.typesetPromise().then(() => {
    //  // Typesetting completed
    //  console.log('MathJax typesetting completed');
    //}).catch((error: any) => {
    //  // Handle typesetting error
    //  console.error('MathJax typesetting error:', error);
    //});


  }

// typesetMathJax(): Promise<void> {
//  return new Promise<void>((resolve, reject) => {
//    MathJax.typeset(undefined, () => {
//      // Typesetting completed
//      resolve();
//    }, () => {
//      // Typesetting failed
//      reject(new Error('MathJax typesetting failed'));
//    });
//  });
//}


  createPlot() {
    this.setDimensions();
    this.createPlotSvgElement();
    this.createPlotGElement();
    this.createUnitCircleContainer();
    this.addRadianNumberLine();
    this.createUnitCircle();
    this.createSineWaveContainer();
    this.addSineAxes();
    this.drawGraph();
    this.plotCreated = true;
    this.renderMathJax();
    // Trigger MathJax rendering
    //MathJax.startup.promise.then(() => {
    //  MathJax.startup.document.clear();
    //  MathJax.startup.document.updateDocument();
    //  MathJax.startup.typesetPromise().then(() => {
    //    // Rendering complete
    //    console.log("MathJax rendering complete");
    //  });
    //});
    
    
  }

  renderMathJax() {
    if (window.MathJax) {
      window.MathJax.typesetPromise()
        .then(() => {
          console.log('MathJax typesetting completed');
        })
        .catch((err: any) => {
          console.error('MathJax typesetting error:', err);
        });
    }
  }

  setDimensions() {
    this.height = this.width * .33;
    this.graphHeight = this.height;
    this.graphWidth = this.width * .75;

    this.xScale = d3.scaleLinear()
      .domain([0, 20])
      .range([0, this.width]);

    this.yScale = d3.scaleLinear()
      .domain([0, 20])
      .range([this.height, 0]);

    this.initialX = this.xScale(0);
    this.initialY = this.yScale(10);

    this.yAxisXCoord = (this.unitCircleRadius * 1.5);
  }

  createPlotSvgElement() {
    this.svg_ElementContainer = d3.select('#plotSvgContainer').append('svg')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  createPlotGElement() {
    let translate = 'translate(' + (this.initialX + this.unitCircleRadius) + ',' + this.initialY + ')';

    this.g_graphContainer = this.svg_ElementContainer
      .append('g')
      .attr('class', 'graph-container')
      .attr('transform', translate);

    console.log('%ccircle', 'color:#ffa500', translate);
  }

  createUnitCircleContainer() {
    this.g_UnitCircleContainer = this.g_graphContainer
      .append('g')
      .attr('class', 'unit-circle-container');
  }

  createUnitCircle() {

    this.g_UnitCircleContainer
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.unitCircleRadius)
      .attr('stroke', 'yellow')
      .attr('fill','transparent')
      .attr('class', 'unit-circle');

    this.hypotenuse = this.g_UnitCircleContainer
      .append('line')
      .attr('class', 'hypotenuse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('stroke', 'white');

    this.opposite = this.g_UnitCircleContainer
      .append('line')
      .attr('class', 'opposite')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('stroke', 'white');

    this.adjacent = this.g_UnitCircleContainer
      .append('line')
      .attr('class', 'adjacent')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('stroke', 'white');

    this.dot = this.g_UnitCircleContainer
      .append('circle')
      .attr('cx', this.unitCircleRadius)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('class', 'circle-guide')
      .attr('fill-opacity', 0.1)
      .style('stroke', '#72c4ff');

    this.verticalDot = this.g_UnitCircleContainer
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('class', 'vertical-guide')
      .attr('fill-opacity', 0.1)
      .style('stroke', '#72c4ff');

    this.joiningLine = this.g_UnitCircleContainer
      .append('line')
      .attr('class', 'joining-line')
      .attr('x1', this.yAxisXCoord)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('stroke', 'white');
  }

  addRadianNumberLine() {
    [
      { val: Math.PI / 4, label: "$$\\frac{\\pi}{4}$$" },
      { val: Math.PI / 2, label: "$$\\frac{\\pi}{2}$$" },
      { val: (3 * Math.PI) / 4, label: "$$\\frac{3\\pi}{4}$$" },
      { val: Math.PI, label: "$$\\pi$$" },
      { val: (5 * Math.PI) / 4, label: "$$\\frac{5\\pi}{4}$$" },
      { val: (3 * Math.PI) / 2, label: "$$\\frac{3\\pi}{2}$$" },
      { val: (7 * Math.PI) / 4, label: "$$\\frac{7\\pi}{4}$$" },
      { val: 2 * Math.PI, label: "$$2\\pi$$" }

    ].forEach((ray) => {
      const cosX = this.unitCircleRadius * Math.cos(ray.val);
      const sinY = this.unitCircleRadius * -Math.sin(ray.val);

      const offsetX = (ray.val > Math.PI / 2 && ray.val < (3 * Math.PI) / 2) ? -20 : -5;
      const offsetY = (ray.val > 0 && ray.val < Math.PI) ? -35 : 0;

      let translate = 'translate(' + (cosX + offsetX) + ',' + (sinY + offsetY) + ')';
      //  console.log('translate', translate);

      this.g_UnitCircleContainer
        .append('g')
        .attr('class', 'tick')
        .attr('stroke', '#888888')
        .append('foreignObject')
        .attr('x', cosX + offsetX)
        .attr('y', sinY + offsetY)
        .attr('width', 50)
        .attr('height', 50)
        .html(`<div class='unit-circle-container' xmlns="http://www.w3.org/1999/xhtml"><span jzMathjax style='color:white'>${ray.label}</span></div>`);

      //MathJax.default.startup.promise.then(() => {
      //  // MathJax rendering completed
      //  console.log('MathJax rendering completed');
      //}).catch((error: any) => {
      //  // Handle startup error
      //  console.error('MathJax startup error:', error);
      //});

      this.g_UnitCircleContainer
        .append('line')
        .attr('class', 'spoke')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', cosX)
        .attr('y2', sinY)
        .style('stroke', 'yellow');
    });
  }

  createSineWaveContainer() {
    this.g_SineWaveContainer = this.g_graphContainer
      .append('g')
      .attr('class', 'sine-wave-container');
  }

  addSineAxes() {
    const intTickFormat:any = d3.format('d');
    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];
    const piMap = { '0': '0', '1.57': '\\pi\\over 2', '3.14': '\\pi', '4.71': '3\\pi\\over 2', '6.28': '2\\pi' };

    // Y-axis-1
    this.yAxisScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([this.unitCircleRadius * 2, 0]);

    const yAxis = d3.axisRight(this.yAxisScale)
      .ticks(3)
      .tickValues([-1, 0, 1])
      .tickFormat(intTickFormat);

    let translate = 'translate(' + this.yAxisXCoord + ',' + (this.unitCircleRadius * -1) + ')';
    console.log('translate addSine yAxis', translate);

    this.g_SineWaveContainer
      .append('g')
      .attr('class', 'y axis left')
      .attr('transform', translate)
      .call(yAxis);

    // Y-axis-2
    translate = 'translate(' + (this.yAxisXCoord + this.graphWidth) + ',' + (this.unitCircleRadius * -1) + ')';
    this.g_SineWaveContainer
      .append('g')
      .attr('class', 'y axis right')
      .attr('transform', translate)
      .call(yAxis);

    // X-axis
    this.xAxisScale = d3.scaleLinear()
      .domain([0, 6.28])
      .range([0, this.graphWidth]);

    const xAxis = d3.axisBottom(this.xAxisScale)
      .tickValues(xTickValues)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      //  .tickFormat((x) =>  '$\pi x$'  )
      //   .tickFormat((x) => '$${ piMap[x] }$')
      ;

    //let tt = $('.x.axis.bottom .tick .text');
    //console.log('tick text', tt);
    let er = this.plotSvgContainer.nativeElement;
    console.log('tick text', er);
    console.log('tick text', d3.selectAll('.tick text'));

    d3.selectAll('.tick text').attr('class', 'myTick');

    translate = 'translate(' + this.yAxisXCoord + ',' + 0 + ')';
    console.log('translate addSine xAxis', translate, this.yAxisXCoord);
    this.g_SineWaveContainer
      .append('g')
      .attr('class', 'x axis bottom')
      .attr('transform', translate)
      .call(xAxis);

    this.axisDot = this.g_SineWaveContainer
      .append('circle')
      .attr('cx', this.unitCircleRadius)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('class', 'axis-guide')
      .style('fill', '#72c4ff')
      .style('stroke', '#72c4ff');
  }

  drawGraph() {
    //   console.log('%crequestAnimationFrame', 'color:red');
    const increase = ((Math.PI * 2) / 360);
    //   console.log('time', this.time);
    this.time += increase;
    this.xIncrement += increase;

    this.drawSineWave();

    if (this.xIncrement > (Math.PI * 2)) {
      this.xIncrement = increase;
    }

    //const axisDotX = this.xAxisScale(this.xIncrement) + this.yAxisXCoord;
    ////   console.log('dots', axisDotX, this.axisDot);
    //this.axisDot
    //  .attr('cx', axisDotX)
    //  .attr('cy', 0);

    const dx = this.unitCircleRadius * Math.cos(this.time);
    const dy = this.unitCircleRadius * -Math.sin(this.time); // counter-clockwise

    this.dot
      .attr('cx', dx)
      .attr('cy', dy);

    this.hypotenuse
      .attr('x2', dx)
      .attr('y2', dy);

    this.opposite
      .attr('x1', dx)
      .attr('y1', dy)
      .attr('x2', dx)
      .attr('y2', 0);

    this.adjacent
      .attr('x1', dx)
      .attr('y1', 0);

    this.verticalDot
      .attr('cy', dy);

    this.joiningLine
      .attr('y1', this.dot.attr('cy'))
      .attr('x2', this.dot.attr('cx'))
      .attr('y2', this.dot.attr('cy'));

    //  console.log('%crequestAnimationFrame','color:orange');
    requestAnimationFrame(this.drawGraph.bind(this));

  }

  drawSineWave() {
  
    d3.select('.sine-curve').remove();
    const sineData = d3.range(0, 54)
      .map(x => x * 10 / 84)
      .map((x) => { return { x: x, y: -Math.sin(x - this.time) }; });
    // console.log('time', this.time);

    const sine:any = d3.line()
      // .interpolate('monotone')
      .x((d:any) => { return this.xAxisScale(d.x); })
      .y((d:any) => { return this.yAxisScale(d.y); });

    // console.log('sine', sine);
    let translate = 'translate(' + this.yAxisXCoord + ',' + (this.unitCircleRadius * -1) + ')';

    this.g_SineWaveContainer.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('transform', translate)
      .attr('stroke', 'white')
      .attr('fill','transparent')
      .attr('d', sine);
  }

}

