export interface WorkspacePanelDefinition {
  id: string;
  title: string;
  panelType: string;
  defaultRatio?: number;
  canClose?: boolean;
  canHide?: boolean;
}
