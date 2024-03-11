import { AfterViewInit, Component } from '@angular/core';
import { DockManager } from '../dock-spawn/src/DockManager';
//import { DockManager } from "../DockSpawn/src/DockManager";
//import { PanelContainer } from "../DockSpawn/src/PanelContainer";
//import { PanelType } from "../DockSpawn/src/enums/PanelType";

@Component({
  selector: 'app-jz-docking',
  templateUrl: './jz-docking.component.html',
  styleUrl: './jz-docking.component.css'
})
export class JzDockingComponent implements AfterViewInit {
    ngAfterViewInit(): void {
      let dockManager = new DockManager(document.getElementById('jz_dock_manager'));
      dockManager.initialize();
    }

}
