import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacdChartComp } from './macd-chart/macd-chart.component';
import { OhlcChartComponent } from './ohlc-chart/ohlc-chart.component';
import { BaseChartComponent } from './base/base-chart/base-chart.component';

@NgModule({
  declarations: [MacdChartComp, BaseChartComponent, OhlcChartComponent],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    MacdChartComp,
    OhlcChartComponent
  ]
})
export class ChartComponentsModule { }
