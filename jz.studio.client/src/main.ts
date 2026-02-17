import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { ShellComponent } from './_shell/shell.component';


// Legacy NgModules you still want available app-wide (temporary is fine)
import { BrowserModule } from '@angular/platform-browser';
import { JzUiControlsModule } from './library/jz-ui-controls/jz-ui-controls.module';
import { AppWelcomeModule } from './_shell/app-welcome/app-welcome.module';
import { AppPartsModule } from './_shell/shell-parts/shell-parts.module';
import { SHELL_ROUTES } from './_shell/shell.routes';


bootstrapApplication(ShellComponent, {
  providers: [
    provideRouter(SHELL_ROUTES),

    provideHttpClient(withInterceptorsFromDi()),

    // Bridge: keep old NgModules alive while you migrate them to standalone
    importProvidersFrom(
      BrowserModule,
      JzUiControlsModule,
      AppWelcomeModule,
      AppPartsModule
    )
  ]
}).catch(err => console.error(err));
