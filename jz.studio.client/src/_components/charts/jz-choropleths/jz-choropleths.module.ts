import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoroUsaComponent } from './components/choro-usa/choro-usa.component';
import { ChoroStateComponent } from './components/choro-state/choro-state.component';
import { CountyPaintingStrategy } from '../../../../libraries/apps/jz-choro-dash/src/lib/interfaces/county-painting-strategy.token';



@NgModule({
  declarations: [
   

  ],
  imports: [
    CommonModule,
  /*  JzChoroplethsRouterModule*/
  ],
 
  exports: [
  
  ]
})
export class JzChoroplethsModule { }
