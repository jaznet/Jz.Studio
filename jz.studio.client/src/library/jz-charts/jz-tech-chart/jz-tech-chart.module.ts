
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzTechChartComponent } from './jz-tech-chart.component';
import { JzTechChartRouterModule } from './jz-tech-chart-router.module';

@NgModule({
  declarations: [JzTechChartComponent],
  imports: [
    CommonModule,
    JzTechChartRouterModule
  ],
  exports: [JzTechChartComponent],
})
export class JazTechChartModule { }
