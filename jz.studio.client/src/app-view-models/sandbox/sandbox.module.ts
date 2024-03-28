
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
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';

@NgModule({
  declarations: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent,
    DashboardViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    JzUiControlsModule,
    JzMenuModule,
    JzPopOversModule,
    GraphicsModule,
    SandboxRouterModule,
    DashboardLayoutModule
  ],
  exports: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent,
    DockingViewComponent,
    DashboardViewComponent
  ]
})
export class SandboxModule { }
