import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JzUiControlsModule } from '../library/jz-ui-controls/jz-ui-controls.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JzUiControlsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
