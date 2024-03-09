import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopoverModule } from 'devextreme-angular';
import { PopoverBaseComponent } from './popover-base/popover-base.component';
import { PopoverHttpErrorComponent } from '../jz-popups/popover-http-error/popover-http-error.component'
import { PopoverLoadingComponent } from '../jz-popups/popover-loading/popover-loading.component'
import { UiControlsModule } from '../ui-controls.module';

@NgModule({
  declarations: [
    PopoverLoadingComponent,
    PopoverHttpErrorComponent,
    PopoverBaseComponent
  ],
  imports: [
    CommonModule,
    DxPopoverModule,
    UiControlsModule
  ],
  exports: [
    PopoverBaseComponent,
    PopoverLoadingComponent,
    PopoverHttpErrorComponent
  ]
})
export class JzPopupsModule { }
