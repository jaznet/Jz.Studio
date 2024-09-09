import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { ChartModule, ChartAllModule } from '@syncfusion/ej2-angular-charts'

@Component({
  selector: 'jz-syncfusion-chart',
  templateUrl: './jz-syncfusion-chart.component.html',
  styleUrl: './jz-syncfusion-chart.component.css'
})
export class JzSyncfusionChartComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit');
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }
}
