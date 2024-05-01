import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzButton3dComponent } from './jz-button3d/jz-button3d.component';
import { JzButtonComponent } from './jz-button/jz-button.component';

@NgModule({
  declarations: [
    JzButtonComponent,
    JzButton3dComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JzButton3dComponent,
    JzButtonComponent
  ]
})
export class JzButtonsModule { }
