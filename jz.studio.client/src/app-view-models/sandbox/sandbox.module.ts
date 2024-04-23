
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { SandboxRouterModule } from './sandbox-router.module';
import { JzUiControlsModule } from '../../library/jz-ui-controls/jz-ui-controls.module';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';
import { JzPopOversModule } from '../../library/jz-pop-overs/jz-pop-overs.module';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { JzDatavizModule } from '../../library/jz-dataviz/jz-dataviz.module';
import { SandboxHomeComponent } from './components/sandbox-home/sandbox-home.component';
import { SandboxMenuComponent } from './components/sandbox-menu/sandbox-menu.component';
import { DockingViewComponent } from './views/docking-view/docking-view.component';
import { DashboardViewComponent } from './views/dashboard-view/dashboard-view.component';
import { GraphicsViewComponent } from './views/graphics-view/graphics-view.component';
import { JzGraphicsModule } from '../../library/jz-graphics/jz-graphics.module';

@NgModule({
  declarations: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent,
    DashboardViewComponent,
    GraphicsViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    JzUiControlsModule,
    JzMenuModule,
    JzPopOversModule,
    JzGraphicsModule,
    SandboxRouterModule,
    DashboardLayoutModule,
    JzDatavizModule
  ],
  exports: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent,
    DashboardViewComponent,
    GraphicsViewComponent
  ]
})
export class SandboxModule { }
