import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacdChartComp } from './macd-chart/macd-chart.component';
import { OhlcChartComponent } from './ohlc-chart/ohlc-chart.component';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';

@NgModule({
  declarations: [MacdChartComp, OhlcChartComponent, VolumeChartComponent],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    MacdChartComp,
    OhlcChartComponent
  ]
})
export class ChartComponentsModule { }
