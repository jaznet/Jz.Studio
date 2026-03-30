import { Injectable } from '@angular/core';
/*import { PanelWorkspaceState } from '../interfaces/panel-workspace-state.interface';*/
import { WorkspacePanelInstance } from '../interfaces/workspace-panel-instance.interface';
import { PanelWorkspaceState } from '../interfaces/panel-workspace-state.interface';

@Injectable({
  providedIn: 'root'
})
export class PanelWorkspaceService {

  getActivePanels(state: PanelWorkspaceState): WorkspacePanelInstance[] {
    return state.panels
      .filter(panel => panel.visible)
      .sort((a, b) => a.order - b.order);
  }

}
