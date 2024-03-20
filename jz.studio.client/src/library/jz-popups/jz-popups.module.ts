import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopoverModule, DxPopupModule } from 'devextreme-angular';
import { PopoverBaseComponent } from './popover-base/popover-base.component';
import { PopoverHttpErrorComponent } from '../jz-popups/popover-http-error/popover-http-error.component'
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { PopUpLoadingComponent } from './pop-up-loading/pop-up-loading.component';
import { JzPopupsService } from './jz-popups.service';
import { PopOverLoadingComponent } from './pop-over-loading/pop-over-loading.component';
import { DynamicPopoverComponent } from './dynamic-popover/dynamic-popover.component';

@NgModule({
  declarations: [
    PopOverLoadingComponent,
    PopoverHttpErrorComponent,
    PopoverBaseComponent,
    PopUpLoadingComponent,
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
    PopUpLoadingComponent,
    DynamicPopoverComponent
  ]
})
export class JzPopupsModule { }
