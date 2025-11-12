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
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

// Optional DevExtreme runtime import (kept here for clarity)
import dxConfig from 'devextreme/core/config';
dxConfig({
  licenseKey:
    'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg=='
});

/* -------------------------------------------------------------------------------------------------
   Paint Worklet registration helpers
------------------------------------------------------------------------------------------------- */

/**
 * Registers the older bevel-corner worklet (for experimental or legacy buttons).
 */
async function registerPaintWorklet() {
  const cssAny = CSS as any; // <-- prevents TS2339: paintWorklet not on CSS type
  if (!('paintWorklet' in cssAny)) {
    console.warn('[Bevel Worklet] paintWorklet not supported.');
    return;
  }
  if ((window as any).__jzBevelLoaded) return;

  const url = '/assets/worklets/jz-bevel-corner-worklet.js';
  try {
    await cssAny.paintWorklet.addModule(url);
    (window as any).__jzBevelLoaded = true;
    console.log('[Bevel Worklet] loaded:', url);
  } catch (err) {
    console.error('[Bevel Worklet] failed:', err);
  }
}

function ensureCuboidPaintWorklet(url = '/assets/worklets/jz-cuboid.worklet.js') {
  const cssAny = CSS as any; // <-- same fix here
  if (!('paintWorklet' in cssAny)) {
    console.warn('[Cuboid Worklet] not supported in this browser.');
    return;
  }
  if ((window as any).__jzCuboidLoaded) return;

  cssAny.paintWorklet
    .addModule(url)
    .then(() => {
      (window as any).__jzCuboidLoaded = true;
      console.log('[Cuboid Worklet] loaded:', url);
      document.documentElement.classList.add('has-paint');
    })
    .catch((err: any) => console.error('[Cuboid Worklet] failed:', err));
}


/* -------------------------------------------------------------------------------------------------
   Invoke both worklet loaders before Angular bootstraps
------------------------------------------------------------------------------------------------- */
registerPaintWorklet();       // Loads jz-bevel-corner-worklet.js
ensureCuboidPaintWorklet();   // Loads jz-cuboid.worklet.js

/* -------------------------------------------------------------------------------------------------
   Angular bootstrap
------------------------------------------------------------------------------------------------- */
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch(console.error);
