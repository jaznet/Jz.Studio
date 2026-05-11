import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSyncfusionChartComponent } from './jz-syncfusion-chart.component';
import { JzSyncfusionChartRoutingModule } from './jz-syncfusion-chart-routing.module';
import { ChartModule, ChartAllModule } from '@syncfusion/ej2-angular-charts'

@NgModule({
  declarations: [
    JzSyncfusionChartComponent
  ],
  imports: [
    CommonModule,
    JzSyncfusionChartRoutingModule,
    ChartModule,
    ChartAllModule
  ],
  exports: [
    JzSyncfusionChartComponent
  ]
})

export class JzSyncfusionChartModule { }
