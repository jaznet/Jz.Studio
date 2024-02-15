import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContentComponent } from './app-content/app-content.component';

@NgModule({
  declarations: [AppContentComponent],
  imports: [
    CommonModule
  ],
  exports: [AppContentComponent]
})
export class AppPartsModule { }
