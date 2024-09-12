import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { range } from 'rxjs';
import * as techan from 'techan'; // Import techan

export interface range {
  start: number;
  end: number;
}

@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svgElementRef!: ElementRef;
  @ViewChild('svgrect', { static: true }) svgRectElementRef!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionA!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionB!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionC!: ElementRef;
  @ViewChild('rectA', { static: true }) rectA!: ElementRef;
  @ViewChild('rectB', { static: true }) rectB!: ElementRef;
  @ViewChild('rectC', { static: true }) rectC!: ElementRef;

  svg!: d3.Selection<any, unknown, null, undefined>;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;
  // margin = 24;
//  range: { start: number; end: number } = { start: 0, end: 0 };
  
  // Initialize the `chart` property with default values
  svgChart: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number; };
    ohlc: { height: number; padding: number; top: number; bottom: number; };
    indicator1: { height: number; padding: number; top: number; bottom: number; };
    indicator2: { height: number; padding: number; top: number; bottom: number; };
    plotArea: { width: number; height: number; };
    sections: { A: range; B: range; C: range }
  } = {
      width: 800, // Default width, adjust as necessary
      height: 600, // Default height, adjust as necessary 
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      ohlc: { height: 300, padding: 10, top: 20, bottom: 20 },
      indicator1: { height: 100, padding: 5, top: 330, bottom: 20 },
      indicator2: { height: 100, padding: 5, top: 455, bottom: 20 },
      plotArea: { width: 760, height: 540 }, // This will be recalculated in `ngAfterViewInit`
      sections: { A: { start: 1, end: 100 }, B: { start: 101, end: 200 }, C: { start: 201, end: 300 } }
    };
 
  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.createtChartLayoutISettings();
    this.createSections();
    this.createAxes();
  }

  createtChartLayoutISettings() {
    this.svg = d3.select(this.svgElementRef.nativeElement);
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.svgRect = d3.select("#plotArea");
    const rectNode = this.svgRect.node(); // Get the actual DOM element
    if (rectNode) {
      const rectDimensions = rectNode.getBoundingClientRect();
      this.svgRectWidth = rectDimensions.width;
      this.svgRectHeight = rectDimensions.height;
    }

    const rangeA: range = { start: 0, end:( this.svgRectHeight * .5)-1 };
    const rangeB: range = { start: this.svgRectHeight * .5, end: (this.svgRectHeight * .75)-1 };
    const rangeC: range = { start: .75, end: this.svgRectHeight };

    this.svgChart.sections = { A: rangeA, B: rangeB, C: rangeC };

    this.svgChart.margins = { top: 36, right: 36, bottom: 36, left: 36 };
    this.svgChart.plotArea.width = this.svgWidth - this.svgChart.margins.left - this.svgChart.margins.right;
    this.svgChart.plotArea.height = this.svgHeight - this.svgChart.margins.top - this.svgChart.margins.bottom;

    console.log(this.svgChart)
  }

  createSections() {
 //   this.rectC.nativeElement.setAttribute('width', this.svgWidth);
  }

  createAxes() {
    // Declare the x (horizontal position) scale.
    // xAxis
    const xAxis = d3.scaleUtc()
      .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .range([0, this.svgChart.plotArea.width]);

    this.svg.append("g")
      .attr("transform", `translate(
        ${this.svgChart.margins.top},
        ${this.svgHeight  - 36})`)
      .call(d3.axisBottom(xAxis));

    // yAxis
    const yAxis = d3.scaleLinear().range([0,this.svgChart.sections.A.end]);

    this.svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(24,0)`)
      .call(d3.axisLeft(yAxis));
  }
}
