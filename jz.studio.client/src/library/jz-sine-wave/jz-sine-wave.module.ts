import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSineWaveComponent } from './jz-sine-wave.component';
import { UnitCircleComponent } from './unit-circle/unit-circle.component';

@NgModule({
  declarations: [JzSineWaveComponent, UnitCircleComponent],
  imports: [
    CommonModule,
  ],
  exports: [JzSineWaveComponent, UnitCircleComponent]
})
export class JzSineWaveModule { }
