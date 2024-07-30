import { Component, AfterViewInit, ViewChild, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

@Component({
  selector: 'jz-sine-wave',
  templateUrl: './jz-sine-wave.component.html',
  styleUrls: ['./jz-sine-wave.component.css']
})
export class JzSineWaveComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('plotSvgContainer', { static: false }) plotSvgContainer!: ElementRef;

  private readonly unitCircleRadius = 100;
  unitCircleOrigin: { cx: number, cy: number } = { cx:0, cy:0};
  private animationFrameId: number | undefined;


  private readonly margin: Margin = { top: 12, right: 12, bottom: 12, left: 36 };
  private width:number = 600;
  private height: number = 400;
  private graphHeight = 0;
  private graphWidth = 0;
  private time = 0;
  private xIncrement = 0;

  private xScale!: d3.ScaleLinear<number, number>;
  private yScale!: d3.ScaleLinear<number, number>;
  private xAxisScale!: d3.AxisScale<number>;
  private yAxisScale!: d3.AxisScale<number>;

  private svgElementContainer!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private graphContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private unitCircleContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private sineWaveContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  private axisDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  private unitCircleDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  private verticalDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  private hypotenuseLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  private oppositeLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  private adjacentLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  private joiningLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;

  constructor() { }

  ngAfterViewInit(): void {
    this.width = this.plotSvgContainer.nativeElement.parentElement.clientWidth - this.margin.left - this.margin.right;
    this.height = this.plotSvgContainer.nativeElement.parentElement.clientHeight -this.margin.bottom - this.margin.top;
    this.initializePlot();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializePlot(): void {
    this.setDimensions();
    this.createSvgElement();
    this.createGraphContainer();
    this.createUnitCircle();
    this.addRadianNumberLine();
    this.createSineWaveContainer();
    this.addGraphAxes();
    this.startAnimation();
    this.renderMathJax();
  }

  private renderMathJax(): void {
    if (window.MathJax) {
      window.MathJax.typesetPromise()
        .then(() => console.log('MathJax typesetting completed'))
        .catch((err: any) => console.error('MathJax typesetting error:', err));
    }
  }

  private setDimensions(): void {
  /*  this.height = this.width * 0.33;*/
    this.graphHeight = this.height;
    this.graphWidth = this.width;// * 0.75;

    this.xScale = d3.scaleLinear().domain([0, 20]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, 20]).range([this.height, 0]);
  }

  private createSvgElement(): void {
    this.svgElementContainer = d3.select('#plotSvgContainer').append('svg')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private createGraphContainer(): void {
    const translate = `translate(${this.xScale(0) + this.unitCircleRadius},${this.yScale(10)})`;

    this.graphContainer = this.svgElementContainer
      .append('g')
      .attr('class', 'graph-container')
      .attr('transform', translate);
  }

  private createUnitCircle(): void {
    this.unitCircleContainer = this.graphContainer.append('g').attr('class', 'unit-circle-container');

    this.unitCircleContainer.append('circle')
      .attr('cx', this.margin.left)
      .attr('cy', 0)
      .attr('r', this.unitCircleRadius)
      .attr('stroke', 'yellow')
      .attr('fill', 'transparent')
      .attr('class', 'unit-circle');

    this.hypotenuseLine = this.addLine(this.unitCircleContainer, 'hypotenuse', 'dodgerblue');
    this.oppositeLine = this.addLine(this.unitCircleContainer, 'opposite', 'seagreen');
    this.adjacentLine = this.addLine(this.unitCircleContainer, 'adjacent', 'white');
    //this.unitCircleDot = this.addCircle(this.unitCircleContainer, 'circle-guide', 4, '#72c4ff');
    //this.verticalDot = this.addCircle(this.unitCircleContainer, 'vertical-guide', 4, '#72c4ff');
    //this.joiningLine = this.addLine(this.unitCircleContainer, 'joining-line', 'white');
  }

  private addLine(container: d3.Selection<SVGGElement, unknown, HTMLElement, any>, className: string, color: string): d3.Selection<SVGLineElement, unknown, HTMLElement, any> {
    return container.append('line')
      .attr('class', className)
      .attr('x1', this.margin.left)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('stroke', color);
  }

  private addCircle(container: d3.Selection<SVGGElement, unknown, HTMLElement, any>, className: string, radius: number, color: string): d3.Selection<SVGCircleElement, unknown, HTMLElement, any> {
    return container.append('circle')
      .attr('cx', this.unitCircleRadius)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('class', className)
      .attr('fill-opacity', 0.1)
      .style('stroke', color);
  }

  private addRadianNumberLine(): void {
    const radianValues = [
      { val: Math.PI / 4, label: "$$\\frac{\\pi}{4}$$" },
      { val: Math.PI / 2, label: "$$\\frac{\\pi}{2}$$" },
      { val: (3 * Math.PI) / 4, label: "$$\\frac{3\\pi}{4}$$" },
      { val: Math.PI, label: "$$\\pi$$" },
      { val: (5 * Math.PI) / 4, label: "$$\\frac{5\\pi}{4}$$" },
      { val: (3 * Math.PI) / 2, label: "$$\\frac{3\\pi}{2}$$" },
      { val: (7 * Math.PI) / 4, label: "$$\\frac{7\\pi}{4}$$" },
      { val: 2 * Math.PI, label: "$$2\\pi$$" }
    ];

    radianValues.forEach((ray) => {
      const cosX = this.unitCircleRadius * Math.cos(ray.val);
      const sinY = this.unitCircleRadius * -Math.sin(ray.val);

      const offsetX = (ray.val > Math.PI / 2 && ray.val < (3 * Math.PI) / 2) ? -20 : -5;
      const offsetY = (ray.val > 0 && ray.val < Math.PI) ? -35 : 0;

      this.unitCircleContainer
        .append('g')
        .attr('class', 'tick')
        .attr('stroke', 'orange')
        .append('foreignObject')
        .attr('x', cosX + offsetX+this.margin.left)
        .attr('y', sinY + offsetY)
        .attr('width', 50)
        .attr('height', 50)
        .html(`<div class='unit-circle-container' xmlns="http://www.w3.org/1999/xhtml"><span jzMathjax style='color:white'>${ray.label}</span></div>`);

      //this.unitCircleContainer
      //  .append('line')
      //  .attr('class', 'spoke')
      //  .attr('x1', this.margin.left)
      //  .attr('y1', 0)
      //  .attr('x2', cosX+this.margin.left)
      //  .attr('y2', sinY)
      //  .style('stroke', 'pink');
    });
  }

  private createSineWaveContainer(): void {
    this.sineWaveContainer = this.graphContainer.append('g').attr('class', 'sine-wave-container');
  }

  private addGraphAxes(): void {
    const intTickFormat: any = d3.format('d');
    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

   this.yAxisScale = d3.scaleLinear().domain([-1, 1]).range([this.unitCircleRadius * 2, 0]);

    const yAxis = d3.axisRight(this.yAxisScale)
      .ticks(3)
      .tickValues([-1, 0, 1])
       .tickFormat(intTickFormat);
    let translate = `translate(${this.unitCircleRadius * 1.5},${this.unitCircleRadius * -1})`;
    this.sineWaveContainer
      .append('g')
      .attr('class', 'y axis left')
      .attr('transform', translate)
      .call(yAxis);

    translate = `translate(${this.unitCircleRadius * 1.5 + this.graphWidth},${this.unitCircleRadius * -1})`;
    this.sineWaveContainer
      .append('g')
      .attr('class', 'y axis right')
      .attr('transform', translate)
      .style('stroke','dodgerblue')
      .call(yAxis);

    this.xAxisScale = d3.scaleLinear().domain([0, 6.28]).range([0, this.graphWidth]);

    const xAxis = d3.axisBottom(this.xAxisScale).tickValues(xTickValues).tickSizeInner(0).tickSizeOuter(0);

    translate = `translate(${this.unitCircleRadius * 1.5},0)`;
    this.sineWaveContainer.append('g').attr('class', 'x axis bottom').attr('transform', translate).call(xAxis);

    this.axisDot = this.sineWaveContainer.append('circle')
      .attr('cx', this.unitCircleRadius)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('class', 'axis-guide')
      .style('fill', '#72c4ff')
      .style('stroke', '#72c4ff');
  }

  private startAnimation(): void {
    this.animateGraph();
  }

  private animateGraph(): void {
    const increment = (Math.PI * 2) / 360;
    this.time += increment;
    this.xIncrement += increment;

    this.updateSineWave();

    if (this.xIncrement > Math.PI * 2) {
      this.xIncrement = increment;
    }

    const dx = this.unitCircleRadius * Math.cos(this.time);
    const dy = this.unitCircleRadius * -Math.sin(this.time);

  //  this.unitCircleDot.attr('cx', dx + this.margin.left).attr('cy', dy);
    this.hypotenuseLine
      .attr('x2', dx + this.margin.left)
      .attr('y2', dy);
    this.oppositeLine
      .attr('x1', dx + this.margin.left)
      .attr('y1', dy)
      .attr('x2', dx + this.margin.left)
      .attr('y2', 0);
    this.adjacentLine
      .attr('x1', this.margin.left)
      .attr('y1', 0)
      .attr('x2', dx + this.margin.left);
  //  this.verticalDot.attr('cy', dy);
   // this.joiningLine.attr('y1', dy).attr('x2', dx + this.margin.left).attr('y2', dy);

    this.animationFrameId = requestAnimationFrame(this.animateGraph.bind(this));
  }

  private updateSineWave(): void {
    d3.select('.sine-curve').remove();
    const sineData = d3.range(0, 54).map(x => x * 10 / 84).map(x => ({ x, y: -Math.sin(x - this.time) }));

    const sine = d3.line<{ x: number, y: number }>()
      .x(d => this.xAxisScale(d.x)!)
      .y(d => this.yAxisScale(d.y)!);

    const translate = `translate(${this.unitCircleRadius * 1.5},${this.unitCircleRadius * -1})`;

    this.sineWaveContainer.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('transform', translate)
      .attr('stroke', 'white')
      .attr('fill', 'transparent')
      .attr('d', sine);
  }
}
