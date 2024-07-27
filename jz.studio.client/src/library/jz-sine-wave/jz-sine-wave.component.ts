import { Component, AfterViewInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
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
  height = 400;
  width = 600;
  margin = 12;
  graphHeight = 0;
  graphWidth = 0;
  unitCircleRadius = 100;

  xScale!: d3.ScaleLinear<number, number>;
  yScale!: d3.ScaleLinear<number, number>;
  xAxisScale!: d3.AxisScale<number>;
  yAxisScale!: d3.AxisScale<number>;
  initialX!: number;
  initialY!: number;
  yAxisXCoord!: number;

  svgElementContainer!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  graphContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  unitCircleContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  sineWaveContainer!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  axisDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  unitCircleDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  verticalDot!: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;
  hypotenuseLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  oppositeLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  adjacentLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  joiningLine!: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;

  time = 0;
  xIncrement = 0;
  plotCreated = false;
  //#endregion

  constructor() { }

  ngAfterViewInit(): void {
    this.width = this.plotSvgContainer.nativeElement.parentElement.clientWidth;
    this.height = this.plotSvgContainer.nativeElement.parentElement.clientHeight;
    this.createPlot();
  }

  createPlot() {
    this.setDimensions();
    this.createSvgElement();
    this.createGraphContainer();
    this.createUnitCircle();
    this.addRadianNumberLine();
    this.createSineWaveContainer();
    this.addSineAxes();
    this.animateGraph();
    this.plotCreated = true;
    this.renderMathJax();
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
    this.height = this.width * 0.33;
    this.graphHeight = this.height;
    this.graphWidth = this.width * 0.75;

    this.xScale = d3.scaleLinear().domain([0, 20]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, 20]).range([this.height, 0]);

    this.initialX = this.xScale(0);
    this.initialY = this.yScale(10);
    this.yAxisXCoord = this.unitCircleRadius * 1.5;
  }

  createSvgElement() {
    this.svgElementContainer = d3.select('#plotSvgContainer').append('svg')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  createGraphContainer() {
    const translate = `translate(${this.initialX + this.unitCircleRadius},${this.initialY})`;

    this.graphContainer = this.svgElementContainer
      .append('g')
      .attr('class', 'graph-container')
      .attr('transform', translate);
  }

  createUnitCircle() {
    this.unitCircleContainer = this.graphContainer.append('g').attr('class', 'unit-circle-container');

    this.unitCircleContainer.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.unitCircleRadius)
      .attr('stroke', 'yellow')
      .attr('fill', 'transparent')
      .attr('class', 'unit-circle');

    this.hypotenuseLine = this.addLine(this.unitCircleContainer, 'hypotenuse', 0, 0, 'white');
    this.oppositeLine = this.addLine(this.unitCircleContainer, 'opposite', 0, 0, 'white');
    this.adjacentLine = this.addLine(this.unitCircleContainer, 'adjacent', 0, 0, 'white');
    this.unitCircleDot = this.addCircle(this.unitCircleContainer, 'circle-guide', this.unitCircleRadius, 0, 4, '#72c4ff');
    this.verticalDot = this.addCircle(this.unitCircleContainer, 'vertical-guide', 0, 0, 4, '#72c4ff');
    this.joiningLine = this.addLine(this.unitCircleContainer, 'joining-line', this.yAxisXCoord, 0, 'white');
  }

  addLine(container: d3.Selection<SVGGElement, unknown, HTMLElement, any>, className: string, x2: number, y2: number, color: string) {
    return container.append('line')
      .attr('class', className)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x2)
      .attr('y2', y2)
      .style('stroke', color);
  }

  addCircle(container: d3.Selection<SVGGElement, unknown, HTMLElement, any>, className: string, cx: number, cy: number, radius: number, color: string) {
    return container.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', radius)
      .attr('class', className)
      .attr('fill-opacity', 0.1)
      .style('stroke', color);
  }

  addRadianNumberLine() {
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
        .attr('x', cosX + offsetX)
        .attr('y', sinY + offsetY)
        .attr('width', 50)
        .attr('height', 50)
        .html(`<div class='unit-circle-container' xmlns="http://www.w3.org/1999/xhtml"><span jzMathjax style='color:white'>${ray.label}</span></div>`);

      this.unitCircleContainer
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
    this.sineWaveContainer = this.graphContainer.append('g').attr('class', 'sine-wave-container');
  }

  addSineAxes() {
    const intTickFormat: any = d3.format('d');
    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    this.yAxisScale = d3.scaleLinear().domain([-1, 1]).range([this.unitCircleRadius * 2, 0]);

    const yAxis = d3.axisRight(this.yAxisScale).ticks(3).tickValues([-1, 0, 1]).tickFormat(intTickFormat);

    let translate = `translate(${this.yAxisXCoord},${this.unitCircleRadius * -1})`;
    this.sineWaveContainer.append('g').attr('class', 'y axis left').attr('transform', translate).call(yAxis);

    translate = `translate(${this.yAxisXCoord + this.graphWidth},${this.unitCircleRadius * -1})`;
    this.sineWaveContainer.append('g').attr('class', 'y axis right').attr('transform', translate).call(yAxis);

    this.xAxisScale = d3.scaleLinear().domain([0, 6.28]).range([0, this.graphWidth]);

    const xAxis = d3.axisBottom(this.xAxisScale).tickValues(xTickValues).tickSizeInner(0).tickSizeOuter(0);

    translate = `translate(${this.yAxisXCoord},0)`;
    this.sineWaveContainer.append('g').attr('class', 'x axis bottom').attr('transform', translate).call(xAxis);

    this.axisDot = this.sineWaveContainer.append('circle')
      .attr('cx', this.unitCircleRadius)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('class', 'axis-guide')
      .style('fill', '#72c4ff')
      .style('stroke', '#72c4ff');
  }

  animateGraph() {
    const increment = (Math.PI * 2) / 360;
    this.time += increment;
    this.xIncrement += increment;

    this.updateSineWave();

    if (this.xIncrement > Math.PI * 2) {
      this.xIncrement = increment;
    }

    const dx = this.unitCircleRadius * Math.cos(this.time);
    const dy = this.unitCircleRadius * -Math.sin(this.time);

    this.unitCircleDot.attr('cx', dx).attr('cy', dy);
    this.hypotenuseLine.attr('x2', dx).attr('y2', dy);
    this.oppositeLine.attr('x1', dx).attr('y1', dy).attr('x2', dx).attr('y2', 0);
    this.adjacentLine.attr('x1', dx).attr('y1', 0);
    this.verticalDot.attr('cy', dy);
    this.joiningLine.attr('y1', dy).attr('x2', dx).attr('y2', dy);

    requestAnimationFrame(this.animateGraph.bind(this));
  }

  updateSineWave() {
    d3.select('.sine-curve').remove();
    const sineData = d3.range(0, 54).map(x => x * 10 / 84).map(x => ({ x, y: -Math.sin(x - this.time) }));

    const sine = d3.line<{ x: number, y: number }>()
      .x(d => this.xAxisScale(d.x)!)
      .y(d => this.yAxisScale(d.y)!);

    const translate = `translate(${this.yAxisXCoord},${this.unitCircleRadius * -1})`;

    this.sineWaveContainer.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('transform', translate)
      .attr('stroke', 'white')
      .attr('fill', 'transparent')
      .attr('d', sine);
  }
}
