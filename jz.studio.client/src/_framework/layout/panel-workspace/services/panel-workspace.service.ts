import { Injectable } from '@angular/core';
import { PanelWorkspaceState } from '../models/panel-workspace-state.interface';
import { WorkspacePanelInstance } from '../models/workspace-panel-instance.interface';

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
