import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopoverModule, DxPopupModule } from 'devextreme-angular';
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { PopOverLoadingComponent } from './pop-over-loading/pop-over-loading.component';
import { DynamicPopoverComponent } from './dynamic-popover/dynamic-popover.component';
import { PopoverHttpErrorComponent } from './pop-over-http-error/pop-over-http-error.component';
import { PopoverBaseComponent } from './pop-over-base/pop-over-base.component';

@NgModule({
  declarations: [
    PopOverLoadingComponent,
    PopoverHttpErrorComponent,
    DynamicPopoverComponent,
  ],
  imports: [
    CommonModule,
    DxPopoverModule,
    DxPopupModule,
    JzUiControlsModule
  ],
  exports: [
    PopOverLoadingComponent,
    PopoverHttpErrorComponent,
    DynamicPopoverComponent
  ]
})
export class JzPopOversModule { }
