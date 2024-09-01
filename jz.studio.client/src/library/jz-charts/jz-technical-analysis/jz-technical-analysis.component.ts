import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  svg!: d3.Selection<SVGSVGElement, undefined, null, undefined>;
  constructor() { }

    ngOnInit(): void {
      console.log('ngOnInit');
    }
  ngAfterViewInit(): void {
    this.svg = d3.create("svg")
      .attr("width", 300)
      .attr("height", 300);
    console.log('%cngAfterViewInit JzTechnicalAnalysisComponent','color:#e6e39e',this.svg);
    }


}
