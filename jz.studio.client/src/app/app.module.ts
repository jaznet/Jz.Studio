// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; // standalone

import { JzUiControlsModule } from '../library/jz-ui-controls/jz-ui-controls.module';
import { AppWelcomeModule } from './app-welcome/app-welcome.module';
import { AppPartsModule } from './app-parts/app-parts.module';
import { SandboxModule } from '../app-view-models/sandbox/sandbox.module';
import { DatavizModule } from '../app-view-models/dataviz/dataviz.module';
import { GraphicsModule } from '../app-view-models/graphics/graphics.module';

@NgModule({
  // declarations: []     // keep empty – don't declare a standalone component
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,     // handles RouterModule.forRoot(...)
    AppComponent,         // <-- add the standalone root here
    JzUiControlsModule,
    AppPartsModule,
    AppWelcomeModule,
    SandboxModule,
    GraphicsModule,
    DatavizModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
