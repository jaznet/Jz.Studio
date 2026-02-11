import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellMenusModule } from './shell-menus/shell-menus.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellMenusModule
  ],
  exports: [
  ]
})
export class AppPartsModule { }
