
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzMenuComponent } from './jz-menu/jz-menu.component';
import { JzMenuTabComponent } from './jz-menu-tab/jz-menu-tab.component';
import { JzMenuContainerComponent } from './jz-menu-container/jz-menu-container.component';
import { MenuTabPanelComponent } from './j3-menu-tab-panel/j3-menu-tab-panel.component';
import { JzUiControlsModule } from '../../library/jz-ui-controls/jz-ui-controls.module';

@NgModule({
  declarations: [
    JzMenuComponent,
 
    MenuTabPanelComponent
  ],
  imports: [
    CommonModule,
    JzUiControlsModule
  ],
  exports: [
    JzMenuComponent,
  
    MenuTabPanelComponent
  ]
})
export class JzMenuModule { }
