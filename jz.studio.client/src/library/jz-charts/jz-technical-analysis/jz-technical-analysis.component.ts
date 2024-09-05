import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as techan from 'techan'; // Import techan

@Component({
  selector: 'jz-technical-analysis',
  templateUrl: './jz-technical-analysis.component.html',
  styleUrl: './jz-technical-analysis.component.css'
})
export class JzTechnicalAnalysisComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('svg', { static: true }) svgElementRef!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionA!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionB!: ElementRef;
  @ViewChild('sectionA', { static: true }) sectionC!: ElementRef;
  @ViewChild('rectA', { static: true }) rectA!: ElementRef;
  @ViewChild('rectB', { static: true }) rectB!: ElementRef;
  @ViewChild('rectC', { static: true }) rectC!: ElementRef;

  svg!: d3.Selection<any, unknown, null, undefined>;
  svgWidth = 0;
  svgHeight = 0;
 // margin = 24;
  
  // Initialize the `chart` property with default values
  chart: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number; };
    ohlc: { height: number; padding: number; top: number; bottom: number; };
    indicator1: { height: number; padding: number; top: number; bottom: number; };
    indicator2: { height: number; padding: number; top: number; bottom: number; };
    plotArea: { width: number; height: number; };
  } = {
      width: 800, // Default width, adjust as necessary
      height: 600, // Default height, adjust as necessary
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      ohlc: { height: 300, padding: 10, top: 20, bottom: 20 },
      indicator1: { height: 100, padding: 5, top: 330, bottom: 20 },
      indicator2: { height: 100, padding: 5, top: 455, bottom: 20 },
      plotArea: { width: 760, height: 540 } // This will be recalculated in `ngAfterViewInit`
    };
 
  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.createtChartLayoutISettings();
    this.createSections();
    this.createAxes();

     console.log('%cngAfterViewInit JzTechnicalAnalysisComponent', 'color:#e6e39e', this.svg);
  }

  createtChartLayoutISettings() {
    this.svg = d3.select(this.svgElementRef.nativeElement);
    this.svgWidth = this.svgElementRef.nativeElement.clientWidth;
    this.svgHeight = this.svgElementRef.nativeElement.clientHeight;

    this.chart.margins = { top: 36, right: 36, bottom: 36, left: 36 };
    this.chart.plotArea.width = this.svgWidth - this.chart.margins.left - this.chart.margins.right;
    this.chart.plotArea.height = this.svgHeight - this.chart.margins.top - this.chart.margins.bottom;
  }

  createSections() {
    this.rectC.nativeElement.setAttribute('width', this.svgWidth);
  }

  createAxes() {
    // Declare the x (horizontal position) scale.
    // xAxis
    const xAxis = d3.scaleUtc()
      .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .range([0, this.chart.plotArea.width]);

    this.svg.append("g")
      .attr("transform", `translate(
        ${this.chart.margins.top},
        ${this.chart.plotArea.height - this.chart.margins.top - this.chart.margins.bottom - 36})`)
      .call(d3.axisBottom(xAxis));

    // yAxis
    const yAxis = d3.scaleLinear().range([this.chart.plotArea.height, 0]);

    this.svg.append("g")
      .attr("transform", `translate(24,0)`)
      .call(d3.axisLeft(yAxis));
  }
}
