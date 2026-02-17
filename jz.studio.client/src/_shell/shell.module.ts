// shell.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JzUiControlsModule } from '../library/jz-ui-controls/jz-ui-controls.module';
import { AppWelcomeModule } from './app-welcome/app-welcome.module';
import { AppPartsModule } from './shell-parts/shell-parts.module';
import { SandboxModule } from '../app-view-models/sandbox/sandbox.module';
import { DatavizModule } from '../app-view-models/dataviz/dataviz.module';
import { GraphicsModule } from '../app-view-models/graphics/graphics.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';
//import { HttpClientModule } from '@angular/common/http';

@NgModule({

  imports: [
    BrowserModule,
    //HttpClientModule,
    ShellRoutingModule,     // handles RouterModule.forRoot(...)
    ShellComponent,         // <-- add the standalone root here
    JzUiControlsModule,
    AppPartsModule,
    AppWelcomeModule,
    //SandboxModule,
    //GraphicsModule,
    //DatavizModule
  ],
  providers: [
    provideHttpClient(
      // keep your existing class-based interceptors working:
      withInterceptorsFromDi()
    ),
  ],
//  bootstrap: [ShellComponent]
})
export class ShellModule { }
