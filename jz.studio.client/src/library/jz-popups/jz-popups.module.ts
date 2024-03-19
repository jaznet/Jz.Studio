import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopoverModule, DxPopupModule } from 'devextreme-angular';
import { PopoverBaseComponent } from './popover-base/popover-base.component';
import { PopoverHttpErrorComponent } from '../jz-popups/popover-http-error/popover-http-error.component'
import { PopoverLoadingComponent } from '../jz-popups/popover-loading/popover-loading.component'
import { JzUiControlsModule } from '../jz-ui-controls/jz-ui-controls.module';
import { PopUpLoadingComponent } from './pop-up-loading/pop-up-loading.component';
import { JzPopupsService } from './jz-popups.service';

@NgModule({
  declarations: [
    PopoverLoadingComponent,
    PopoverHttpErrorComponent,
    PopoverBaseComponent,
    PopUpLoadingComponent,
  
  ],
  imports: [
    CommonModule,
    DxPopoverModule,
    DxPopupModule,
    JzUiControlsModule
  ],
  exports: [
    PopoverBaseComponent,
    PopoverLoadingComponent,
    PopoverHttpErrorComponent,
    PopUpLoadingComponent,
   
  ]
})
export class JzPopupsModule { }
