import { Component, AfterViewInit, Input, ViewChild, ElementRef } from "@angular/core";
import { scaffold } from "../../../interfaces/techan-interfaces";

@Component({
  selector: 'base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements AfterViewInit {
  @Input() scaffold!: scaffold;

  viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryDrawWhenReady();
  }

  public tryDrawWhenReady(): void {
    // This becomes safe if overridden in child
    if (this.viewReady) {
      this.drawChart('base try');  // Optional no-op if not overridden
    }
  }

  protected drawChart(chartName:string): void {
    // Default no-op; override in child
  }

  //public getChartGroup(): SVGGElement {
  //  return this.gChartRef.nativeElement;
  //}
}


