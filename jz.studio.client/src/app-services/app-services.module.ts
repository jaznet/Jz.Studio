import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppServices } from './app-service.service';



@NgModule({
  declarations: [
    AppServices
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AppServices
  ]
})
export class AppServicesModule { }
