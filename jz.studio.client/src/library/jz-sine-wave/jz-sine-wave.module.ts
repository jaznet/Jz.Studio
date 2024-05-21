import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSineWaveComponent } from './jz-sine-wave.component';

@NgModule({
  declarations: [JzSineWaveComponent],
  imports: [
    CommonModule,
  ],
  exports: [JzSineWaveComponent]
})
export class JzSineWaveModule { }
