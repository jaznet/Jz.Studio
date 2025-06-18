import { ElementRef, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';
import { ChartDataService } from '../../chart-data.service';
import { LayoutService } from '../../layout.service';
import { take } from 'rxjs';

@Directive()
export abstract class BaseChartComponent implements AfterViewInit {
  // View readiness flag for async coordination
  protected dataReady = false;
  protected viewReady = false;
  public isViewInitialized = false;

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

  constructor(
    protected dataService: ChartDataService,
    protected layoutService: LayoutService
  ) { }

  ngAfterViewInit(): void {
    this.layoutService.macdSizeReady$.pipe(take(1)).subscribe(({ width, height }) => {
      this.setSize(width, height);
    });
   // console.log('%c🧱 MacdChartComp constructor', 'color:#b68f40');
    this.viewReady = true;
    this.tryDrawChart();
  }

  setSize(width: number, height: number): void {
    console.log('%csetSize', 'color:blue')
    this.rSectionRef.nativeElement.setAttribute('width', width.toString());
    this.rSectionRef.nativeElement.setAttribute('height', height.toString());

    this.rContentRef.nativeElement.setAttribute('width', width.toString());
    this.rContentRef.nativeElement.setAttribute('height', height.toString());

    this.gAxisRightRef.nativeElement.setAttribute(
      'transform',
      `translate(${width}, 0)`
    );
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
