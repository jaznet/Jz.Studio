// main.ts (Angular 17–20)

(window as any).DevExpress = (window as any).DevExpress || {};
(window as any).DevExpress.config = { licenseKey: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg==' };

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';

// (optional) DevExtreme license early
import dxConfig from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';

dxConfig({ licenseKey: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg==' });

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    // importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(console.error);

// main.ts
const cssAny = CSS as any;

async function registerPaintWorklet() {
  try {
    if (!cssAny || !('paintWorklet' in cssAny)) {
      console.warn('PaintWorklet not supported in this browser.');
      return;
    }

    // Serve from assets + force fresh load in dev
    const urlBase = '/assets/worklets/jz-bevel-corner-worklet.js';
    const url = `${urlBase}?v=${Date.now()}`;

    // Preflight fetch — surfaces 404s cleanly
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Worklet 404/HTTP ${r.status} at ${url}`);

    await cssAny.paintWorklet.addModule(url);
    console.log('[Worklet] loaded:', url);

    // (Optional) mark document so CSS can switch from fallback to worklet
    document.documentElement.classList.add('has-paint');
  } catch (err) {
    console.error('[Worklet] failed to load:', err);
  }
}
registerPaintWorklet();


