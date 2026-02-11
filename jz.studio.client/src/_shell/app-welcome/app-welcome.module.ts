import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppWelcomeComponent } from './app-welcome/app-welcome.component';
import { RouterModule } from '@angular/router';
import { ShellRoutingModule } from '../shell-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { JzUiControlsModule } from '../../library/jz-ui-controls/jz-ui-controls.module';
import { LogonModule } from '../shell-parts/app-logon/logon/logon.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule, 
    RouterModule,
    ShellRoutingModule,
    ReactiveFormsModule,
    JzUiControlsModule,
    LogonModule
  ],
  exports: [
  
  ]
})
export class AppWelcomeModule { }
