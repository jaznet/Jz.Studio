import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSpirographComponent } from './jz-spirograph.component';
import { JzSpirographService } from './jz-spirograph.service';
import { DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { UtilitiesModule } from '../../utilities/utilities.module';

@NgModule({
  declarations: [
    JzSpirographComponent,
   // JzSpirographService
  ],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    JzUiControlsModule,
    UtilitiesModule
  ],
  exports: [
    JzSpirographComponent,
  // JzSpirographService],
  ]
})
export class JzSpirographModule { }
