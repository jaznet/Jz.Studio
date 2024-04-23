import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { GraphicsRouterModule } from './graphics-router.module';
import { GraphicsMenuComponent } from './components/graphics-menu/graphics-menu.component';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';


@NgModule({
  declarations: [
    GraphicsHomeComponent,
    GraphicsMenuComponent
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule,
  
    JzMenuModule
  ],
  exports: [
    GraphicsHomeComponent,
    GraphicsMenuComponent
  ]
})
export class GraphicsModule { }
