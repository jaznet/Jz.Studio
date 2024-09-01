import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSyncfusionChartComponent } from './jz-syncfusion-chart.component';
import { JzSyncfusionChartRoutingModule } from './jz-syncfusion-chart-routing.module';

@NgModule({
  declarations: [
    JzSyncfusionChartComponent
  ],
  imports: [
    CommonModule,
    JzSyncfusionChartRoutingModule
  ],
  exports: [
    JzSyncfusionChartComponent
  ]
})

export class JzSyncfusionChartModule { }
