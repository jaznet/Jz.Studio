import { ElementRef, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { ChartDataService } from '../../chart-data.service';

@Directive()
export abstract class BaseChartComponent implements AfterViewInit {
  // View readiness flag for async coordination
  protected dataReady = false;
  protected viewReady = false;

  @ViewChild('gSection', { static: true }) gSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rSection', { static: true }) rSectionRef!: ElementRef<SVGRectElement>;

  @ViewChild('gContent', { static: true }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: true }) rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: true }) gChartRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisLeft', { static: true }) gAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupLeft', { static: true }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: true }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisRight', { static: true }) gAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupRight', { static: true }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: true }) rAxisRectRightRef!: ElementRef<SVGRectElement>;

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
  protected buildRefs(): ChartElementRefs {
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
