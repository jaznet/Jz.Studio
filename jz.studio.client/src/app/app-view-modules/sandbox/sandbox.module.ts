
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxHomeComponent } from './sandbox-home/sandbox-home.component';
import { SandboxMenuComponent } from './sandbox-menu/sandbox-menu.component';
import { RouterModule } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { SandboxRouterModule } from './sandbox-router.module';
import { JzUiControlsModule } from '../../../library/jz-ui-controls/jz-ui-controls.module';
import { JzMenuModule } from '../../../library/jz-ui-controls/jz-menu/jz-menu.module';

@NgModule({
  declarations: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SandboxRouterModule,
    JzUiControlsModule,
    //UtilitiesModule,
    JzMenuModule,
    //JzPopupsModule,
    //GraphicsModule
  ],
  exports: [
    SandboxComponent,
    SandboxHomeComponent,
    SandboxMenuComponent
  ]
})
export class SandboxModule { }
