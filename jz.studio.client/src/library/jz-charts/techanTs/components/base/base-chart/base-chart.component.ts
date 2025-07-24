import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
})
export abstract class BaseChartComponent implements OnInit, AfterViewInit {
  // === Lifecycle state flags ===
  protected inputsReady = false;
  protected viewReady = false;
  protected layoutReady = false;
  protected dataReady = false;
  protected drawStarted = false;

  // === ViewChild references ===
  // @region ViewChild references
  @ViewChild('gChartContainer', { static: false }) gChartContainerRef!: ElementRef<SVGGElement>;
  @ViewChild('rChartContainer', { static: false }) rChartContainerRef!: ElementRef<SVGRectElement>;

  @ViewChild('gAxisGroupLeft', { static: false }) gAxisGroupLeftRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectLeft', { static: false }) rAxisRectLeftRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisLeft', { static: false }) gAxisLeftRef!: ElementRef<SVGGElement>;

  @ViewChild('gAxisGroupRight', { static: false }) gAxisGroupRightRef!: ElementRef<SVGGElement>;
  @ViewChild('rAxisRectRight', { static: false }) rAxisRectRightRef!: ElementRef<SVGRectElement>;
  @ViewChild('gAxisRight', { static: false }) gAxisRightRef!: ElementRef<SVGGElement>;

  @ViewChild('gContent', { static: false }) gContentRef!: ElementRef<SVGGElement>;
  @ViewChild('rContent', { static: false }) rContentRef!: ElementRef<SVGRectElement>;
  @ViewChild('gChart', { static: false }) gChartRef?: ElementRef<SVGGElement>; // Optional for derived draw target
  // @endregion ViewChild references

  // === Abstract draw method ===
  protected abstract drawChart(caller: string): void;

  // === Lifecycle hooks ===
  ngOnInit(): void {
    this.inputsReady = true;
    this.checkReadyToDraw('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.checkReadyToDraw('ngAfterViewInit');
  }

  // === External triggers (from TechanTsComponent) ===
  public setDataReady(): void {
    this.dataReady = true;
    this.checkReadyToDraw('setDataReady');
  }

  public markLayoutReady(): void {
    this.layoutReady = true;
    this.checkReadyToDraw('markLayoutReady');
  }

  // === Master sync check ===
  protected checkReadyToDraw(caller: string): void {
    const ready =
      this.inputsReady &&
      this.viewReady &&
      this.layoutReady &&
      this.dataReady &&
      !!this.gChartRef;

    console.log(`🧩 checkReadyToDraw from ${caller}: ready=${ready}`, {
      inputs: this.inputsReady,
      view: this.viewReady,
      layout: this.layoutReady,
      data: this.dataReady,
      gChartRef: !!this.gChartRef
    });

    if (ready && !this.drawStarted) {
      this.drawStarted = true;
      this.drawChart(caller);
    }
  }
}
