import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svgElementRef!: ElementRef;
 
  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    const svg = d3.select(this.svgElementRef.nativeElement);
    //this.svg = d3.create("svg")
    //  .attr("width", 300)
    //  .attr("height", 300);
    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
      .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .range([0, 300]);

    svg.append("g")
      .attr("transform", `translate(0,250)`)
      .call(d3.axisBottom(x));

    console.log('%cngAfterViewInit JzTechnicalAnalysisComponent', 'color:#e6e39e', svg);
   
  }


}
