import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { PaletteMenuComponent } from './palette-menu/palette-menu.component';
import { JzUiControlsModule } from '../../../library/jz-ui-controls/jz-ui-controls.module';

@NgModule({
  declarations: [
    MainMenuComponent,
    PaletteMenuComponent
  ],
  imports: [
    CommonModule,
    JzUiControlsModule,
  /*  JzMenuModule,*/
    RouterModule,
   /* AppRouterModule*/
  ],
  exports: [
    MainMenuComponent,
    PaletteMenuComponent
  ]
})
export class AppMenusModule { }
