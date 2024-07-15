
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JzUiControlsModule } from '../library/jz-ui-controls/jz-ui-controls.module';
import { AppWelcomeModule } from './app-welcome/app-welcome.module';
import { AppPartsModule } from './app-parts/app-parts.module';
import { RouterModule } from '@angular/router';
import { SandboxModule } from '../app-view-models/sandbox/sandbox.module';
import { DatavizModule } from '../app-view-models/dataviz/dataviz.module';
import { GraphicsModule } from '../app-view-models/graphics/graphics.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
   /* JzPopupsModule,*/
    AppRoutingModule,
    JzUiControlsModule,
    AppPartsModule,
    AppWelcomeModule,
    SandboxModule,
    GraphicsModule,
    DatavizModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
