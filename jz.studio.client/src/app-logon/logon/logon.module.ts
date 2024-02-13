import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogonComponent } from './logon.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app/app-routing.module';

@NgModule({
  declarations: [
    LogonComponent
  ],
  imports: [
    CommonModule,
   // UiControlsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule
  ],
  exports: [
    LogonComponent 
  ]
})
export class LogonModule { }
