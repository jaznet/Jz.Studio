
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { JzPlotterService } from '../jz-plotter.service';

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

@Component({
  selector: 'unit-circle',
  templateUrl: './unit-circle.component.html',
  styleUrl: './unit-circle.component.css'
})
export class UnitCircleComponent implements AfterViewInit {
  @Input() width: number = 400;
  @Input() height: number = 400;

  private svgElement!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private gElement!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private unitCircleGroup!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private unitCircleContainer!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private unitCircle!: any;
  private unitCircleRadius = 100;
  private origin: { x: number; y: number } = { x: 0, y: 0 };
  private radius: number = 0;
  private margin: Margin = { top: 12, right: 12, bottom: 12, left: 36 };

  constructor(private plotter:JzPlotterService) { }

  ngAfterViewInit(): void {
    console.log(this.plotter.radianValues);
    this.origin.x = this.width / 2;
    this.origin.y = this.height / 2;
    this.radius = (this.width * .5) / 2;

    this.svgElement = d3.select('#svgElement')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);

    this.gElement = d3.select('#gElement');

    this.unitCircleGroup = d3.select('#unitCircleGroup')
    this.unitCircleGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius)
      .attr('stroke', '#a7aaa4')
      .attr('fill', 'transparent')
      .attr('class', 'unit-circle');

    this.unitCircleGroup
      .attr('transform', 'translate(200,200)');

    this.plotter.radianValues.forEach((ray) => {
       let cosX = this.unitCircleRadius * Math.cos(ray.val);
       let sinY = this.unitCircleRadius * -Math.sin(ray.val);

      const offsetX = (ray.val > Math.PI / 2 && ray.val < (3 * Math.PI) / 2) ? -20 : -5;
      const offsetY = (ray.val > 0 && ray.val < Math.PI) ? -35 : 0;

      this.unitCircleGroup
    
        .append('line')
        .attr('class', 'spoke')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', cosX)
        .attr('y2', sinY)
        .style('stroke', 'black');

      cosX = (this.unitCircleRadius * 1.2) * Math.cos(ray.val);
      sinY = (this.unitCircleRadius * 1.2) * -Math.sin(ray.val);

      this.unitCircleGroup
        .append('circle')
        .attr('class', 'spoke')
        .attr('cx', cosX)
        .attr('cy', sinY)  
        .attr('r', 3)
        .style('stroke', 'yellow');

      console.log(ray);

     })
  }
}
