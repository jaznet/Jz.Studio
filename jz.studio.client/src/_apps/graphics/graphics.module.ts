import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { GraphicsRouterModule } from './graphics-router.module';
import { GraphicsMenuComponent } from './components/graphics-menu/graphics-menu.component';
import { RouterModule } from '@angular/router';
import { GraphicsComponent } from './graphics.component';
import { JzGraphicsModule } from '../../library/jz-graphics/jz-graphics.module';
import { RaindomTreeViewComponent } from './views/raindom-tree-view/raindom-tree-view.component';
import { SinewaveViewComponent } from './views/sinewave-view/sinewave-view.component';
import { JzSpirographModule } from '../../library/jz-spirograph/jz-spirograph.module';
import { JzMathJaxDirective } from '../../library/jz-math-jax/jz-math-jax.directive';
import { JzPlotterModule } from '../../library/jz-plotter/jz-plotter.module';
import { JzMenuModule } from '../../components/menus/jz-menu.module';


@NgModule({
  declarations: [
    RaindomTreeViewComponent,
    SinewaveViewComponent,
    JzMathJaxDirective
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule,
    RouterModule,
    JzMenuModule,
    JzGraphicsModule,
    JzPlotterModule,
   JzSpirographModule
  ],
  exports: [
    RaindomTreeViewComponent,
    SinewaveViewComponent
  ]
})
export class GraphicsModule { }
