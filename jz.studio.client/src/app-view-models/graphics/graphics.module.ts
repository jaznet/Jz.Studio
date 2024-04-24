import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { GraphicsRouterModule } from './graphics-router.module';
import { GraphicsMenuComponent } from './components/graphics-menu/graphics-menu.component';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';
import { RouterModule } from '@angular/router';
import { GraphicsComponent } from './graphics.component';
import { JzGraphicsModule } from '../../library/jz-graphics/jz-graphics.module';
import { RaindomTreeViewComponent } from './views/raindom-tree-view/raindom-tree-view.component';


@NgModule({
  declarations: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent,
    RaindomTreeViewComponent
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule,
    RouterModule,
    JzMenuModule,
    JzGraphicsModule

  ],
  exports: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent,
    RaindomTreeViewComponent
  ]
})
export class GraphicsModule { }
