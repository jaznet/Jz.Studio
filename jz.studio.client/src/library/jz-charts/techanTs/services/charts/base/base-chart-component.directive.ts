import { ElementRef, ViewChild, Directive } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Directive()
export abstract class BaseChartComponent {
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

  // Utility method
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
        rAxis: this.rAxisRectLeftRef
      },
      axisRight: {
        gAxis: this.gAxisRightRef,
        gAxisGroup: this.gAxisGroupRightRef,
        rAxis: this.rAxisRectRightRef
      }
    };
  }
}
