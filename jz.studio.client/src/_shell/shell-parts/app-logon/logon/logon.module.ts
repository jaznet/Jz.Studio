import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogonComponent } from './logon.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JzUiControlsModule } from '../../../../library/jz-ui-controls/jz-ui-controls.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
     
  ]
})
export class LogonModule { }
