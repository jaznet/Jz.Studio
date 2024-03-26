import { Component, OnInit } from '@angular/core';
import { DockManager } from '../../../library/jz-docking/dock-spawn/src/DockManager';

@Component({
  selector: 'app-docking-view',
  templateUrl: './docking-view.component.html',
  styleUrl: './docking-view.component.css'
})
export class DockingViewComponent implements OnInit {

  ngOnInit(): void {
    let dockManager = new DockManager(document.getElementById('dock_manager'));
    dockManager.initialize();
    console.log(dockManager);
  }

}
