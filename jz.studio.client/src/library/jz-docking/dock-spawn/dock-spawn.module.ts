import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockManager } from './src/DockManager';



@NgModule({
  declarations: [
    //DockManager,
    //DockWheel,
    //DockManagerContext,
    //DockLayoutEngine,
    //EventHandler,
    //PanelContainer,
    //Point,
    //DockConfig,
    //FillDockContainer,
    //Dialog,
    //TabPage,
    //DockGraphSerializer,
    //DockGraphDeserializer
  ]
  ,
  imports: [
    CommonModule
  ],
  exports: [
   // DockManager,
    //DockManagerContext
  ]
})
export class DockSpawnModule { }

export * from './src/interfaces/ILayoutEventListener';
export * from './src/interfaces/IState';
export * from './src/interfaces/IDockContainerWithSize';

