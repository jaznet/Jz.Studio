import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacdChartComp } from './macd-chart/macd-chart.component';



@NgModule({
  declarations: [MacdChartComp],
  exports: [
    MacdChartComp
  ]
})
export class ChartComponentsModule { }
