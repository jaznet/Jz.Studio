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
  protected layoutReady = false;
  protected dataReady = false;
  protected drawStarted = false;

  protected viewInitialized = false;     // Replaces: viewReady
  protected inputsInitialized = false;   // Replaces: inputsReady + maybe dataReady + layoutReady
  protected drawAttempted = false;       // Replaces: drawStarted


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
    this.inputsInitialized = true;
    this.checkAndDraw('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.checkAndDraw('ngAfterViewInit');
  }

  // === External triggers (from TechanTsComponent) ===
  public setDataReady(): void {
    this.dataReady = true;
    this.checkAndDraw('setDataReady');
  }

  public markLayoutReady(): void {
    this.layoutReady = true;
    this.checkAndDraw('markLayoutReady');
  }

  // === Master sync check ===
  protected checkAndDraw(caller: string = 'unknown'): void {
    const ready =
      this.viewInitialized &&
      this.inputsInitialized &&
      this.layoutReady &&
      this.dataReady &&
      !!this.gChartRef;

    console.log(`🧩 checkAndDraw from ${caller}: ready=${ready}`, {
      viewInitialized: this.viewInitialized,
      inputsInitialized: this.inputsInitialized,
      layoutReady: this.layoutReady,
      dataReady: this.dataReady,
      gChartRef: !!this.gChartRef
    });

    if (ready && !this.drawAttempted) {
      this.drawAttempted = true;
      this.drawChart(caller); // Optionally pass caller
    }
  }

}
