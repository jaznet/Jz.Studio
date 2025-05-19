
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechanTsComponent } from './techanTs.component';
import { TechanTsRoutingModule } from './techanTs-routing.module';
import { JzPopOversModule } from '../../../jz-pop-overs/jz-pop-overs.module';
import { MacdChartComponent } from '../components/macd-chart/macd-chart.component';

@NgModule({
  declarations: [TechanTsComponent,
    MacdChartComponent],
  imports: [
    CommonModule,
    RouterModule,
    TechanTsRoutingModule,
    JzPopOversModule,
  ],
  exports: [TechanTsComponent]
})
export class TechanTsModule { }
