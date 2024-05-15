
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomTreeComponent } from './random-tree/random-tree.component';
import { JzSineWaveComponent } from './jz-sine-wave/jz-sine-wave/jz-sine-wave.component';
import { JzSpirographComponent } from '../jz-spirograph/jz-spirograph.component';
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    RandomTreeComponent,
    JzSineWaveComponent,
   
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
    DxDataGridModule,
    DxDropDownBoxModule 

  ],
  exports: [
    RandomTreeComponent,
    JzSineWaveComponent,
   
  ],
})
export class JzGraphicsModule { }
