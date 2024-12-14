import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';
import { CandlestickChartComponent } from './candlestick-chart/candlestick-chart.component';

@NgModule({
  declarations: [
    CandlestickChartComponent,
    VolumeChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CandlestickChartComponent,
    VolumeChartComponent
  ]
})
export class ChartsModule { }
