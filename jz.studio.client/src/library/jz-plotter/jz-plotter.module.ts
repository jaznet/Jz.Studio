import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinePlotComponent } from './sine-plot/sine-plot.component';
import { UnitCircleComponent } from './unit-circle/unit-circle.component';



@NgModule({
  declarations: [
    SinePlotComponent,
    UnitCircleComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SinePlotComponent,
    UnitCircleComponent
  ]
})
export class JzPlotterModule { }
