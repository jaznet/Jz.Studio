
import { ElementRef, ViewChild, Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { take } from 'rxjs';
import { ChartDataService } from '../../../services/chart-data.service';
import { LayoutService } from '../../../services/layout.service';
import { ScalesService } from '../../../services/scales.service';
import { scaffold } from '../../../interfaces/techan-interfaces';
import { ChartType } from '../../../enums/chart-type';

@Component({
  selector: 'base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements AfterViewInit, OnChanges {
  @Input() xScale!: any;
  @Input() data!: any[];
  @Input() scaffold!: scaffold;

  protected chartType!: ChartType;

  protected viewReady = false;
  public isViewInitialized = false;

  protected axisLeft: any;
  protected axisRight: any;

  @ViewChild('gChartContainer', { static: false }) gSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer', { static: false }) rSectionRef!: ElementRef<SVGRectElement>;

  @ViewChild('gContent', { static: false }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChartRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisLeft', { static: false }) gAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: false }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisRight', { static: false }) gAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: false }) rAxisRectRightRef!: ElementRef<SVGRectElement>;

  constructor(
    protected dataService: ChartDataService,
    protected layoutService: LayoutService,
    protected scales:ScalesService
  ) {
    console.log('%c BASE', 'color:red', this.chartType);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.isViewInitialized = true;
    this.tryDrawChart();
  }

  private xScaleReady = false;
  private dataReady = false;
  private scaffoldReady = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xScale'] && this.xScale) this.xScaleReady = true;
    if (changes['data'] && Array.isArray(this.data) && this.data.length > 0) this.dataReady = true;
    if (changes['scaffold'] && this.scaffold) this.scaffoldReady = true;

 
    console.log('ngOnChanges', {
      viewReady: this.viewReady,
      xScaleReady: this.xScaleReady,
      dataReady: this.dataReady,
      scaffoldReady: this.scaffoldReady,
      data: this.data,
      xScale: this.xScale,
      scaffold: this.scaffold
    });

    if (this.viewReady && this.xScaleReady && this.dataReady && this.scaffoldReady) {
      console.log('%c🔥 Calling tryDrawChart()', 'color: orange');
      this.tryDrawChart();
    }
  }

  protected tryDrawChart(): void {
/*    if (!this.viewReady || !this.data?.length || !this.xScale || !this.scaffold) return;*/

    this.drawChart();
  }

  protected drawChart(): void {
    console.warn('drawChart() not implemented in derived class.');
  }

  setSize(width: number, height: number): void {
    this.rSectionRef.nativeElement.setAttribute('width', width.toString());
    this.rSectionRef.nativeElement.setAttribute('height', height.toString());
    this.rContentRef.nativeElement.setAttribute('width', width.toString());
    this.rContentRef.nativeElement.setAttribute('height', height.toString());
    this.gAxisRightRef.nativeElement.setAttribute('transform', `translate(${width}, 0)`);
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
