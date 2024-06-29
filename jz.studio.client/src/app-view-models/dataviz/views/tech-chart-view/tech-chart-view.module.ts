import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechChartViewComponent } from './tech-chart-view.component';
import { JazTechChartModule } from '../../../../library/jz-charts/jz-tech-chart/jz-tech-chart.module';


@NgModule({
  declarations: [TechChartViewComponent],
  imports: [
    CommonModule,
    JazTechChartModule
  ],
  exports: [TechChartViewComponent],
})
export class TechChartViewModule { }
