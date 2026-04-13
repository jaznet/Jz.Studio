// techanTs.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechanTsRoutingModule } from './technical-analysis-routing.module';
import { ChartComponentsModule } from './components/chart-components.module';

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    RouterModule,
    TechanTsRoutingModule,
    ChartComponentsModule,
  ],
  exports: []
})
export class TechanTsModule { }
