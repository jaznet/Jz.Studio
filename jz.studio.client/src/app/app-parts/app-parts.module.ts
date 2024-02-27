import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppMenusModule } from './app-menus/app-menus.module';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppContentComponent } from './app-content/app-content.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppFooterComponent,
    AppContentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppMenusModule
  ],
  exports: [
    AppHeaderComponent,
    AppFooterComponent,
    AppContentComponent
  ]
})
export class AppPartsModule { }
