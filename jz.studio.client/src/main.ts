// main.ts (Angular 17–20)

(window as any).DevExpress = (window as any).DevExpress || {};
(window as any).DevExpress.config = { licenseKey: 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogIjg5ZDllODBlLWJlZTUtNDBlNS1iNmMxLWE0YTVhYWI4ZjBiNCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.QDKR+lQMnLPehvairIOqrJ7sI85QgDFXY/ZH6jQj5FVV7xp4p7NmoGm07AAmjaXjI5RqzxCwv+a8irYBEs6Fxa7dWAybnrUl1Ozke69HMqY9aWXrynF6blJIj4cF3GWOmyHrtg==' };

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
/*import { routes } from './app/app.routes';*/
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
