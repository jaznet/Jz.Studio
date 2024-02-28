import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoroUsaComponent } from './components/choro-usa/choro-usa.component';
import { ChoroStateComponent } from './components/choro-state/choro-state.component';



@NgModule({
  declarations: [
    ChoroUsaComponent,
    ChoroStateComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChoroUsaComponent,
    ChoroStateComponent
  ]
})
export class JzChoroplethsModule { }
