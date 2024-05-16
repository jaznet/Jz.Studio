import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpirographViewComponent } from './spirograph-view.component';
import { JzSpirographModule } from '../../../../library/jz-spirograph/jz-spirograph.module';



@NgModule({
  declarations: [SpirographViewComponent],
  imports: [
    CommonModule,
    JzSpirographModule
  ],
  exports: [SpirographViewComponent],
})
export class SpirographViewModule { }
