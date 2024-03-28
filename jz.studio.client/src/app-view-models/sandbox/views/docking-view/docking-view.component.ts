import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { DockManager } from '../../../../library/jz-docking/dock-spawn/src/DockManager';
import { PanelType } from '../../../../library/jz-docking/dock-spawn/src/enums/PanelType';
import { PanelContainer } from '../../../../library/jz-docking/dock-spawn/src/PanelContainer';
@Component({
  selector: 'app-docking-view',
  templateUrl: './docking-view.component.html',
  styleUrl: './docking-view.component.css'
})
export class DockingViewComponent implements OnInit, AfterViewInit {

  @HostBinding('class') classes = 'fit-to-parent ';

  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {
    let dockManager = new DockManager(document.getElementById('my_dock_manager'));
    dockManager.initialize();
    console.log(dockManager);
   
    // Convert existing elements on the page into "Panels".
    // They can then be docked on to the dock manager
    // Panels get a titlebar and a close button, and can also be
    // converted to a floating dialog box which can be dragged / resized
    const solution = this.createElementContainer("solution_window", dockManager);
    const properties = this.createElementContainer("properties_window", dockManager);
    const toolbox = this.createElementContainer("toolbox_window", dockManager);
    const outline = this.createElementContainer("outline_window", dockManager);
    const state = this.createElementContainer("state_window", dockManager);
    const output = this.createElementContainer("output_window", dockManager);
    const editor1 = this.createElementContainer("editor1_window", dockManager, undefined, PanelType.document);
    const editor2 = this.createElementContainer("editor2_window", dockManager, undefined, PanelType.document);
    editor2!.hideCloseButton(true);
    let infovis = this.createElementContainer("infovis",dockManager); // invisible Dialog has no size, so size it manually
    infovis!.width = 600;
    infovis!.height = 400;

    // Dock the panels on the dock manager
    let documentNode = dockManager.context!.model.documentManagerNode;

    let outlineNode;
    let outputNode;

    if (documentNode) {
     if(outline)  outlineNode = dockManager.dockLeft(documentNode, outline, 0.15);
      if (output) outputNode = dockManager.dockDown(documentNode, output, 0.2);
      if (toolbox) dockManager.dockRight(documentNode, toolbox, 0.20);
      if (editor1) dockManager.dockFill(documentNode, editor1);
      if (editor2) dockManager.dockFill(documentNode, editor2);
    }

    if (outputNode&&state) dockManager.dockRight(outputNode, state, 0.40);
    if (infovis) dockManager.floatDialog(infovis, 50, 50);
    if (outlineNode&&solution) dockManager.dockFill(outlineNode, solution);
    if (outlineNode&&properties) dockManager.dockDown(outlineNode, properties, 0.6);
  }

    createElementContainer(id: string, dockManager: DockManager, title?: string, panelType?: PanelType) {
  const element = document.getElementById(id);
  if (element) {
    return new PanelContainer(element, dockManager, title, panelType);
  } else {
    console.error(`Element with ID '${id}' was not found.`);
    // Handle the error appropriately, possibly by returning null or throwing an error
    return;
  }
}
}
