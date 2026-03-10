// shell.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JzUiControlsModule } from '../library/jz-ui-controls/jz-ui-controls.module';
import { AppWelcomeModule } from './app-welcome/app-welcome.module';
import { AppPartsModule } from './shell-parts/shell-parts.module';
import { SandboxModule } from '../_apps/sandbox/sandbox.module';
import { GraphicsModule } from '../_apps/graphics/graphics.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ShellComponent } from './shell.component';

@NgModule({

  imports: [
    BrowserModule,
    ShellComponent,         // <-- add the standalone root here
    JzUiControlsModule,
    AppPartsModule,
    AppWelcomeModule
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
