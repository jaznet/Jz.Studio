import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzButtonComponent } from './jz-button/jz-button.component';
import { JzRadioButtonComponent } from './jz-radio-button/jz-radio-button.component';
import { JzTabComponent } from './jz-tab/jz-tab.component';
import { DayOfWeekComponent } from './day-of-week/day-of-week.component';

@NgModule({
  declarations: [
    JzButtonComponent,
    JzRadioButtonComponent,
    JzTabComponent,
    DayOfWeekComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JzButtonComponent,
    JzRadioButtonComponent,
    JzTabComponent,
    DayOfWeekComponent
  ]
})
export class JzUiControlsModule { }
