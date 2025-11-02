import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayOfWeekComponent } from './day-of-week/day-of-week.component';
import { JzSpinnerComponent } from './jz-spinner/jz-spinner.component';
import { ElapsedTimeComponent } from './elapsed-time/elapsed-time.component';

@NgModule({
  declarations: [
   

    DayOfWeekComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    
   
    DayOfWeekComponent
  ]
})
export class JzUiControlsModule { }
