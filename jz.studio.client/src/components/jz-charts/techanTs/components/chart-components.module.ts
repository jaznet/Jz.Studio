import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacdChartComponent } from './macd-chart/macd-chart.component';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';
import { RsiChartComponent } from './rsi-chart/rsi-chart.component';
import { OhlcChartComponent } from '../charts/ohlc/ohlc-chart.component';

@NgModule({
  declarations: [MacdChartComponent, VolumeChartComponent, RsiChartComponent],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    MacdChartComponent
  ]
})
export class ChartComponentsModule { }
