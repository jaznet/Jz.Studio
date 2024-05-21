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
import { SinewaveViewComponent } from './views/sinewave-view/sinewave-view.component';
import { JzSpirographModule } from '../../library/jz-spirograph/jz-spirograph.module';
import { JzSineWaveModule } from '../../library/jz-sine-wave/jz-sine-wave.module';


@NgModule({
  declarations: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent,
    RaindomTreeViewComponent,
    SinewaveViewComponent
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule,
    RouterModule,
    JzMenuModule,
    JzGraphicsModule,
    JzSineWaveModule,
   JzSpirographModule
  ],
  exports: [
    GraphicsComponent,
    GraphicsHomeComponent,
    GraphicsMenuComponent,
    RaindomTreeViewComponent,
    SinewaveViewComponent
  ]
})
export class GraphicsModule { }
