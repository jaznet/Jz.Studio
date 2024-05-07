
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomTreeComponent } from './random-tree/random-tree.component';
import { JzSineWaveComponent } from './jz-sine-wave/jz-sine-wave/jz-sine-wave.component';

@NgModule({
  declarations: [
    RandomTreeComponent,
    JzSineWaveComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RandomTreeComponent,
    JzSineWaveComponent
  ],
})
export class JzGraphicsModule { }
