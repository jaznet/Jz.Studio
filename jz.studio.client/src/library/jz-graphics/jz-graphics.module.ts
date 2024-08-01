
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomTreeComponent } from './random-tree/random-tree.component';
/*import { JzSpirographComponent } from '../jz-spirograph/jz-spirograph.component';*/
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    RandomTreeComponent,
    
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
    DxDataGridModule,
    DxDropDownBoxModule 

  ],
  exports: [
    RandomTreeComponent,
     
  ],
})
export class JzGraphicsModule { }
