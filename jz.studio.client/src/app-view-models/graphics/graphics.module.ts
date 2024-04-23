import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { GraphicsRouterModule } from './graphics-router.module';
import { GraphicsMenuComponent } from './components/graphics-menu/graphics-menu.component';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';
import { RouterModule } from '@angular/router';
import { GraphicsComponent } from './graphics.component';


@NgModule({
  declarations: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule,
    RouterModule,
    JzMenuModule
  ],
  exports: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent
  ]
})
export class GraphicsModule { }
