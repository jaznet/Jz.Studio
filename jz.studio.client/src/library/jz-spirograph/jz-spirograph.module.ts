import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzSpirographComponent } from './jz-spirograph.component';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxDataGridModule } from 'devextreme-angular';
import { JzRadioButtonComponent } from '../jz-ui-controls/jz-radio-button/jz-radio-button.component';
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';



@NgModule({
  declarations: [
    JzSpirographComponent
  ],
  imports: [
    CommonModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    JzUiControlsModule
  ],
  exports: [
    JzSpirographComponent
  ],
})
export class JzSpirographModule { }
