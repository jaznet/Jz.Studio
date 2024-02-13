import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzButtonComponent } from './jz-button/jz-button.component';

@NgModule({
  declarations: [JzButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [JzButtonComponent]
})
export class JzUiControlsModule { }
