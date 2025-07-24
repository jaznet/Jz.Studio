import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    AfterViewInit,
    SimpleChanges,
    OnChanges,
    OnInit
} from '@angular/core';
import { scaffold } from '../../../interfaces/techan-interfaces';
import { ChartType } from '../../../enums/chart-type';


@Component({
    selector: 'base-chart',
    templateUrl: './base-chart.component.html',
    styleUrls: ['./base-chart.component.scss']
})
export abstract class BaseChartComponent implements AfterViewInit, OnChanges, OnInit {
    @Input() scaffold!: scaffold;

    // #region ViewChild List
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
    @ViewChild('gChart') gChartRef?: ElementRef<SVGGElement>;

    // #endregion ViewChild List
    protected inputsReady = false;
    protected viewReady = false;
    protected layoutReady = false;
    protected dataReady = false;
    protected drawStarted = false;

    chartType!: ChartType;

  constructor() { }

    ngOnInit(): void {
      this.inputsReady = true;
      console.log('%c🔍 gChartRef onInit', 'color:orange', this.gChartRef);
      this.checkReadyToDraw('ngOnInit');
    }

    ngAfterViewInit(): void {
        this.viewReady = true;
        // Log the ViewChild reference
        console.log('%c🔍 gChartRef afterViewInit', 'color:orange', this.gChartRef);
        this.checkReadyToDraw('ngAfterViewInit');
    }

    ngOnChanges(_changes: SimpleChanges): void {
        console.log('%c _changes base', _changes);
    }

    protected checkReadyToDraw(caller: string): void {
        const ready = this.inputsReady &&
            this.viewReady &&
            this.layoutReady &&
            this.dataReady &&
            !!this.gChartRef;

        console.log(`🧩 checkReadyToDraw from ${caller}: ready=${ready}`, {
            inputs: this.inputsReady,
            view: this.viewReady,
            layout: this.layoutReady,
            data: this.dataReady,
            gChartRef: !!this.gChartRef,
        });

      if (ready && !this.drawStarted) {
        this.drawStarted = true;
        this.drawChart(caller);
      } else {
        console.log('NOT READY',)
      }
    }



    /* protected abstract sizeChartContainer(caller: string): void;*/
    protected abstract drawChart(caller: string): void;
}
