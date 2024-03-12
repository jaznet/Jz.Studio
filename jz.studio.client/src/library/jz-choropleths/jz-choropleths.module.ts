import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoroUsaComponent } from './components/choro-usa/choro-usa.component';
import { ChoroStateComponent } from './components/choro-state/choro-state.component';
import { CountyPaintingStrategy } from './interface/county-painting-strategy';



@NgModule({
  declarations: [
    ChoroUsaComponent,
    ChoroStateComponent,  
  ],
  imports: [
    CommonModule,
  /*  JzChoroplethsRouterModule*/
  ],
 
  exports: [
    ChoroUsaComponent,
    ChoroStateComponent, 
  ]
})
export class JzChoroplethsModule { }
