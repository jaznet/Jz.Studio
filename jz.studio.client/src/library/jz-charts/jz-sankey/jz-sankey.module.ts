import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyComponent } from './jz-sankey.component';
import { DxSankeyModule } from 'devextreme-angular';

@NgModule({
  declarations: [SankeyComponent],
  imports: [
    CommonModule,
    DxSankeyModule
  ],
  exports: [SankeyComponent],
})
export class JzSankeyModule { }
