import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'unit-circle',
  templateUrl: './unit-circle.component.html',
  styleUrl: './unit-circle.component.css'
})
export class UnitCircleComponent implements AfterViewInit {

  private width: number = 150;
  private height: number = 150;
  private unitCircle: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined; 
  /* @ViewChild('unitCircleContainer', { static: false }) unitCircleContainer!: ElementRef;*/


  ngAfterViewInit(): void {
    this.unitCircle = d3.select('#unitCircleContainer').append('svg')
      .attr('id', 'svgElement')
      .attr('class', 'svg-element')
      .attr('width', this.width)
      .attr('height', this.height);
  }
}
