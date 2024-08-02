
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { JzPlotterService } from '../jz-plotter.service';

@Component({
  selector: 'unit-circle',
  templateUrl: './unit-circle.component.html',
  styleUrl: './unit-circle.component.css'
})
export class UnitCircleComponent implements AfterViewInit {
  @Input() width: number = 400;
  @Input() height: number = 400;

  private unitCircleContainer!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private unitCircle!: any;
  private origin: { x: number; y: number } = { x: 0, y: 0 };
  private radius: number = 0;

  /* @ViewChild('unitCircleContainer', { static: false }) unitCircleContainer!: ElementRef;*/

  constructor(private plotter:JzPlotterService) { }

  ngAfterViewInit(): void {
    console.log(this.plotter.radianValues);
    this.origin.x = this.width / 2;
    this.origin.y = this.height / 2;
    this.radius = (this.width * .5)/2;

    this.unitCircleContainer = d3.select('#unitCircleContainer').append('svg')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);

    this.unitCircle = this.unitCircleContainer.append('g').attr('class', 'unit-circle-container');

    this.unitCircle.append('circle')
      .attr('cx', this.origin.x)
      .attr('cy', this.origin.y)
      .attr('r', this.radius)
      .attr('stroke', 'yellow')
      .attr('fill', 'transparent')
      .attr('class', 'unit-circle');

    this.plotter.radianValues.forEach((ray) => {
      console.log(ray);
     })
  }
}
