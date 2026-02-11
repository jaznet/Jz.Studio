import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { JzUiControlsModule } from '../../../library/jz-ui-controls/jz-ui-controls.module';
import { ShellRoutingModule } from '../../shell-routing.module';
import { JzMenuModule } from '../../../library/jz-menu/jz-menu.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
    JzMenuModule,
    RouterModule,
    ShellRoutingModule
  ],
  exports: [
  ]
})
export class ShellMenusModule { }
