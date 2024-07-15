import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyComponent } from './jz-sankey.component';
import { DxSankeyModule } from 'devextreme-angular';
import { JzSankeyRouterModule } from './jz-sankey-router.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SankeyComponent],
  imports: [
    CommonModule,
    RouterModule,
    DxSankeyModule,
    JzSankeyRouterModule
  ],
  exports: [SankeyComponent],
})
export class JzSankeyModule { }
