import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';

import { scaffold } from '../../../interfaces/techan-interfaces';
import { ChartType } from '../../../enums/chart-type';

@Component({
  selector: 'base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export abstract class BaseChartComponent implements AfterViewInit {
  @Input() scaffold!: scaffold;

  protected inputsReady = false;
  protected viewReady = false;

  chartType!: ChartType;

  @ViewChild('gChartContainer') gChartContainerRef!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer') rChartContainerRef!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisGroupLeft') gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft') rAxisRectLeftRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft') gAxisLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisGroupRight') gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight') rAxisRectRightRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight') gAxisRightRef!: ElementRef<SVGGElement>;

  @ViewChild('gContent') gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent') rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart') gChartRef!: ElementRef<SVGGElement>;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryDrawWhenReady('ngAfterViewInit');
  }

  ngOnChanges(_changes: SimpleChanges): void {
    console.log('%c _changes base', _changes);
  }

  markInputsReady(): void {
    this.inputsReady = true;
    this.tryDrawWhenReady('markInputsReady');
  }

  protected tryDrawWhenReady(caller: string): void {
    const section = this.scaffold?.sections?.[this.chartType];
    const isSized = !!section && section.width > 0 && section.height > 0;
    const ready = this.inputsReady && this.viewReady && !!this.gChartRef;

    console.log('%c    ✔ tryDrawWhenReady called by', 'color:orangered', caller);
    console.log(`%c 🟡 ${caller}: ready=${ready}`, 'color:orange', 'gChartRef', this.gChartRef);
    //  {
    //  inputs: this.inputsReady,
    //  view: this.viewReady,
    //  sized: isSized,
    //  gChartRef: !!this.gChartRef
    //});

    if (ready && isSized) {
      this.drawChart(caller);
    }
  }

  protected abstract drawChart(caller: string): void;
}
