import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacdChartComponent } from './macd-chart/macd-chart.component';
import { OhlcChartComponent } from './ohlc-chart/ohlc-chart.component';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';
import { RsiChartComponent } from './rsi-chart/rsi-chart.component';

@NgModule({
  declarations: [MacdChartComponent, OhlcChartComponent, VolumeChartComponent, RsiChartComponent],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    MacdChartComponent,
    OhlcChartComponent
  ]
})
export class ChartComponentsModule { }
