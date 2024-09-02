import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svg!: any;
 // svg!: d3.Selection<SVGSVGElement, undefined, null, undefined>;
  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    //this.svg = d3.create("svg")
    //  .attr("width", 300)
    //  .attr("height", 300);
    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
      .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .range([0, 300]);

   

    console.log('%cngAfterViewInit JzTechnicalAnalysisComponent', 'color:#e6e39e', this.svg);
  }


}
