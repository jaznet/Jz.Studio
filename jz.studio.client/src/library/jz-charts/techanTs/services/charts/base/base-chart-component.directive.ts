import { ElementRef, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { ChartDataService } from '../../chart-data.service';

@Directive()
export abstract class BaseChartComponent implements AfterViewInit {
  // View readiness flag for async coordination
  protected dataReady = false;
  protected viewReady = false;

  @ViewChild('gSection', { static: false }) gSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rSection', { static: false }) rSectionRef!: ElementRef<SVGRectElement>;

  @ViewChild('gContent', { static: false }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisLeft', { static: false }) gAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: false }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisRight', { static: false }) gAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: false }) rAxisRectRightRef!: ElementRef<SVGRectElement>;

  constructor(protected dataService: ChartDataService) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryDrawChart();
  }

  // Concrete subclasses should override this if they need to draw
  protected tryDrawChart(): void {
    // Placeholder: subclasses implement their drawing coordination here
  }

  //setDataInput(data: any[]): void {
  //  this.data = data;
  //  this.dataReady = true;
  //  this.tryDrawChart();
  //}

  // Utility to collect references into a single object
  public buildRefs(): ChartElementRefs {
    return {
      gSection: this.gSectionRef,
      rSection: this.rSectionRef,
      gContent: this.gContentRef,
      rContent: this.rContentRef,
      gChart: this.gChartRef,
      axisLeft: {
        gAxis: this.gAxisLeftRef,
        gAxisGroup: this.gAxisGroupLeftRef,
        rAxis: this.rAxisRectLeftRef,
      },
      axisRight: {
        gAxis: this.gAxisRightRef,
        gAxisGroup: this.gAxisGroupRightRef,
        rAxis: this.rAxisRectRightRef,
      }
    };
  }
}
