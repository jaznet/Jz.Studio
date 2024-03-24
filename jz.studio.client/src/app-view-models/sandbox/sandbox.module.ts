
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxHomeComponent } from './sandbox-home/sandbox-home.component';
import { SandboxMenuComponent } from './sandbox-menu/sandbox-menu.component';
import { RouterModule } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { SandboxRouterModule } from './sandbox-router.module';
import { JzUiControlsModule } from '../../library/jz-ui-controls/jz-ui-controls.module';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';
import { GraphicsModule } from '../../library/graphics/graphics.module';
import { JzPopOversModule } from '../../library/jz-pop-overs/jz-pop-overs.module';
import { DockingViewComponent } from './docking-view/docking-view.component';

@NgModule({
  declarations: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    JzUiControlsModule,
    JzMenuModule,
    JzPopOversModule,
    GraphicsModule,
    SandboxRouterModule,
  ],
  exports: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent
  ]
})
export class SandboxModule { }
