// sankey-view.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyViewComponent } from './sankey-view.component';
import { JzSankeyModule } from '../../../../_components/charts/jz-sankey/jz-sankey.module';


@NgModule({
  declarations: [SankeyViewComponent],
  imports: [
    CommonModule,
    JzSankeyModule
  ],
  exports: [SankeyViewComponent],
})
export class SankeyViewModule { }
