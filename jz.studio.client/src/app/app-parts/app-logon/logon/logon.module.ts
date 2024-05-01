import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogonComponent } from './logon.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JzUiControlsModule } from '../../../../library/jz-ui-controls/jz-ui-controls.module';
import { AppRoutingModule } from '../../../app-routing.module';
import { JzButtonsModule } from '../../../../library/jz-buttons/jz-buttons.module';

@NgModule({
  declarations: [
    LogonComponent
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    JzButtonsModule
  ],
  exports: [
    LogonComponent 
  ]
})
export class LogonModule { }
