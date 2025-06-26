import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChartDataService } from '../../../services/chart-data.service';
import { LayoutService } from '../../../services/layout.service';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrl: './base-chart.component.css'
})
export class BaseChartComponent implements AfterViewInit {

  @ViewChild('gChartContainer', { static: false }) gChartContainerRef!: ElementRef<SVGGElement>;
  @ViewChild('gContent', { static: false }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisLeft', { static: false }) gAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: false }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) gAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: false }) rAxisRectRightRef!: ElementRef<SVGRectElement>;

   isViewInitialized = false;
   viewReady = false;
  constructor(
     public chartDataService: ChartDataService,
     public layoutService: LayoutService
  ) {
   
  }

    ngAfterViewInit(): void {
      console.log('base:', this .gChartContainerRef);
  }

  gContainer!: ElementRef<SVGGElement>;
  rContainer!: ElementRef<SVGRectElement>;
  gChart!: ElementRef<SVGGElement>;
  gAxisGroup: any;
  rAxis: any;

  public buildRefs(): void {
 
    this.gContainer = this.gContentRef;
    this.rContainer = this.rContentRef;
    this.gChart = this.gChartRef;
      //axisLeft: {
      //  gAxis: this.gAxisLeftRef,
      //  this.gAxisGroup: this.gAxisGroupLeftRef,
      //  this.rAxis: this.rAxisRectLeftRef,
      //},
      //axisRight: {
      //  gAxis: this.gAxisRightRef,
      //  this.gAxisGroup: this.gAxisGroupRightRef,
      //  this.rAxis: this.rAxisRectRightRef,
      //}
 
  }

  //public buildRefs(): ChartElementRefs {
  //  return {
  //    gContainer: this.gContentRef,
  //    rContainer: this.rContentRef,
  //    gChart: this.gChartRef,
  //    axisLeft: {
  //      gAxis: this.gAxisLeftRef,
  //      gAxisGroup: this.gAxisGroupLeftRef,
  //      rAxis: this.rAxisRectLeftRef,
  //    },
  //    axisRight: {
  //      gAxis: this.gAxisRightRef,
  //      gAxisGroup: this.gAxisGroupRightRef,
  //      rAxis: this.rAxisRectRightRef,
  //    }
  //  };
  //}
}
