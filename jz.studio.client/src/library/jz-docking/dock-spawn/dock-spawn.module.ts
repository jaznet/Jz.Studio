import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockManagerContext } from './src/DockManagerContext';
import { DockManager } from './src/DockManager';
import { DockWheel } from './src/DockWheel';
import { DockLayoutEngine } from './src/DockLayoutEngine';
import { EventHandler } from './src/EventHandler';
import { PanelContainer } from './src/PanelContainer';
import { Point } from './src/Point';
import { DockConfig } from './src/DockConfig';
import { FillDockContainer } from './src/FillDockContainer';
import { Dialog } from './src/Dialog';
import { SplitterDockContainer } from './src/SplitterDockContainer';
import { TabPage } from './src/TabPage';



@NgModule({
  declarations: [
    DockManager,
    DockWheel,
    DockManagerContext,
    DockLayoutEngine,
    EventHandler,
    PanelContainer,
    Point,
    DockConfig,
    FillDockContainer,
    Dialog,
    TabPage
  ]
  ,
  imports: [
    CommonModule
  ],
  exports: [
    DockManager,
    DockManagerContext]
})
export class DockSpawnModule { }

export * from './src/interfaces/ILayoutEventListener';
export * from './src/interfaces/IState';
export * from './src/interfaces/IDockContainerWithSize';

