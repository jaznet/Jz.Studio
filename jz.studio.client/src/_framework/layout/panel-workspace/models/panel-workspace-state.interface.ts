
import { PanelWorkspaceLayoutMode } from './panel-workspace-layout-mode.enum';
import { WorkspacePanelDefinition } from './workspace-panel-definition.interface';
import { WorkspacePanelInstance } from './workspace-panel-instance.interface';

export interface PanelWorkspaceState {
  workspaceId: string;
  layoutMode: PanelWorkspaceLayoutMode;
  definitions: WorkspacePanelDefinition[];
  panels: WorkspacePanelInstance[];
}
