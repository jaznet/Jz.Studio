
import { ElementRef, ViewChild, Directive } from '@angular/core';
import { ChartElementRefs } from '../../../interfaces/chart-element-refs';

@Directive() // allows abstract component with decorators
export abstract class BaseChartComponent {
  // SECTION + CONTENT + CHART elements
  @ViewChild('gSection', { static: true }) gSectionRef!: ElementRef<SVGGElement>;
  @ViewChild('rSectionRect', { static: true }) rSectionRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('gContent', { static: true }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContentRect', { static: true }) rContentRectRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: true }) gChartRef!: ElementRef<SVGGElement>;

  // LEFT AXIS
  @ViewChild('gAxisLeft', { static: true }) gAxisLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupLeft', { static: true }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: true }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;

  // RIGHT AXIS
  @ViewChild('gAxisRight', { static: true }) gAxisRightRef!: ElementRef<SVGGElement>;
  @ViewChild('gAxisGroupRight', { static: true }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: true }) rAxisRectRightRef!: ElementRef<SVGRectElement>;

  // ✅ Reusable helper method
  protected buildRefs(): ChartElementRefs {
    return {
      gSection: this.gSectionRef,
      rSection: this.rSectionRectRef,
      gContent: this.gContentRef,
      rContent: this.rContentRectRef,
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
