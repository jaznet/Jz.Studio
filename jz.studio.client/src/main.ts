// main.ts

// =================================================================================================
// main.ts — Angular 17–20
// Initializes DevExtreme license, registers Paint Worklets (bevel + cuboid), and bootstraps the app.
// =================================================================================================

/* -------------------------------------------------------------------------------------------------
   DevExtreme license setup
------------------------------------------------------------------------------------------------- */
(window as any).DevExpress = (window as any).DevExpress || {};
(window as any).DevExpress.config = {
  licenseKey:
    'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg=='
};

/* -------------------------------------------------------------------------------------------------
   Angular imports
------------------------------------------------------------------------------------------------- */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
//import { AppRoutingModule } from './shell/shell-routing.module';
//import { AppComponent } from './app/app.component';

// Optional DevExtreme runtime import (kept here for clarity)
import dxConfig from 'devextreme/core/config';
import { ShellComponent } from './_shell/shell.component';
import { ShellRoutingModule } from './_shell/shell-routing.module';
dxConfig({
  licenseKey:
    'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg=='
});

/* -------------------------------------------------------------------------------------------------
   Paint Worklet registration helpers
------------------------------------------------------------------------------------------------- */

// main.ts

// Allow CSS.paintWorklet to exist
declare const CSS: any;

// main.ts
if ('paintWorklet' in (CSS as any)) {
  (CSS as any).paintWorklet
    .addModule('assets/worklets/jz-corners-bd.js') // note: no leading slash
    .then(() => {
      console.log('✅ jz-corners-bd paint worklet loaded');
    })
    .catch((err: any) => {
      console.error('❌ Failed to load jz-corners-bd paint worklet', err);
    });
} else {
  console.warn('⚠️ CSS.paintWorklet not supported in this browser');
}




/* -------------------------------------------------------------------------------------------------
   Angular bootstrap
------------------------------------------------------------------------------------------------- */
bootstrapApplication(ShellComponent, {
  providers: [
    importProvidersFrom(ShellRoutingModule),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch(console.error);
