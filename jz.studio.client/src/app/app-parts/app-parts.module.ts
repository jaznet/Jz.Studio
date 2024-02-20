import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppMenusModule } from './app-menus/app-menus.module';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppMenusModule
  ],
  exports: [AppHeaderComponent]
})
export class AppPartsModule { }
