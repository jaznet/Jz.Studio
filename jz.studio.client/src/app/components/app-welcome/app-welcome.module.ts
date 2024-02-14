import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppWelcomeComponent } from './app-welcome/app-welcome.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { JzUiControlsModule } from '../../../library/jz-ui-controls/jz-ui-controls.module';


@NgModule({
  declarations: [
    AppWelcomeComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    JzUiControlsModule
  //  LogonModule
  ],
  exports: [
    AppWelcomeComponent,
  ]
})
export class AppWelcomeModule { }
