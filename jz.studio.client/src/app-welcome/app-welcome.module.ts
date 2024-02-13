import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppWelcomeComponent } from './app-welcome/app-welcome.component';
import { UiControlsModule } from '../library/ui-controls/ui-controls.module';
import { AppRouterModule } from '../app/app-router/app-router.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LogonModule } from '../app/app-logon/logon/logon.module';

@NgModule({
  declarations: [
    AppWelcomeComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule,
    AppRouterModule,
    ReactiveFormsModule,
    UiControlsModule,
    LogonModule
  ],
  exports: [
    AppWelcomeComponent,
  ]
})
export class AppWelcomeModule { }
