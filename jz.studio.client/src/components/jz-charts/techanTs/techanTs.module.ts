// techanTs.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechanTsRoutingModule } from './techanTs-routing.module';
import { JzPopOversModule } from '../../../library/jz-pop-overs/jz-pop-overs.module';
import { ChartComponentsModule } from './components/chart-components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    TechanTsRoutingModule,
    ChartComponentsModule,
    JzPopOversModule,
  ],
  exports: []
})
export class TechanTsModule { }
