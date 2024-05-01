import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzRadioButtonComponent } from './jz-radio-button/jz-radio-button.component';
import { DayOfWeekComponent } from './day-of-week/day-of-week.component';
import { JzSpinnerComponent } from './jz-spinner/jz-spinner.component';
import { ElapsedTimeComponent } from './elapsed-time/elapsed-time.component';

@NgModule({
  declarations: [
   
    JzRadioButtonComponent,
    DayOfWeekComponent,
    JzSpinnerComponent,
    ElapsedTimeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    
    JzRadioButtonComponent,
    DayOfWeekComponent,
    JzSpinnerComponent,
    ElapsedTimeComponent
  ]
})
export class JzUiControlsModule { }
