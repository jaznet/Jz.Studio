import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzTechnicalAnalysisComponent } from './jz-technical-analysis.component';
import { RouterModule } from '@angular/router';
import { JzTechnicalAnalysisRoutingModule } from './jz-technical-analysis-routing.module';
import { JzPopOversModule } from '../../../../library/jz-pop-overs/jz-pop-overs.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    JzTechnicalAnalysisRoutingModule,
    JzPopOversModule
  ],
  exports: []
})
export class JzTechnicalAnalysisModule { }
