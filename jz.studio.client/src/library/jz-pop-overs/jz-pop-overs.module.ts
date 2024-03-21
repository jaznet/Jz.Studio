import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopoverModule, DxPopupModule } from 'devextreme-angular';
import { PopoverBaseComponent } from './popover-base/popover-base.component';
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { PopOverLoadingComponent } from './pop-over-loading/pop-over-loading.component';
import { DynamicPopoverComponent } from './dynamic-popover/dynamic-popover.component';
import { PopoverHttpErrorComponent } from './popover-http-error/popover-http-error.component';

@NgModule({
  declarations: [
    PopOverLoadingComponent,
    PopoverHttpErrorComponent,
    PopoverBaseComponent,
    DynamicPopoverComponent,
  ],
  imports: [
    CommonModule,
    DxPopoverModule,
    DxPopupModule,
    JzUiControlsModule
  ],
  exports: [
    PopoverBaseComponent,
    PopOverLoadingComponent,
    PopoverHttpErrorComponent,
    DynamicPopoverComponent
  ]
})
export class JzPopOversModule { }
