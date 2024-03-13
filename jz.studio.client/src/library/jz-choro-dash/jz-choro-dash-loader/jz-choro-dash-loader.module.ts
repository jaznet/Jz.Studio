
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashLoaderComponent } from './jz-choro-dash-loader.component';
import { JzChoroDashLoaderRouterModule } from './jz-choro-dash-loader-router.module';

@NgModule({
  declarations: [JzChoroDashLoaderComponent],
  imports: [
    CommonModule,
    JzChoroDashLoaderRouterModule
  ],
  exports: [JzChoroDashLoaderComponent],
})
export class JzChoroDashLoaderModule { }
