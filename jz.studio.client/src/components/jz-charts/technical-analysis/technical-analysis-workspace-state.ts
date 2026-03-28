
import { PanelWorkspaceLayoutMode } from "../../../_framework/layout/panel-workspace/models/panel-workspace-layout-mode.enum";
import { PanelWorkspaceState } from "../../../_framework/layout/panel-workspace/models/panel-workspace-state.interface";


export const TECHNICAL_ANALYSIS_WORKSPACE_STATE: PanelWorkspaceState = {
  workspaceId: 'technical-analysis-main',
  layoutMode: PanelWorkspaceLayoutMode.Stacked,
  definitions: [
    {
      id: 'ohlc',
      title: 'OHLC',
      panelType: 'chart',
      defaultRatio: 3
    },
    {
      id: 'volume',
      title: 'Volume',
      panelType: 'chart',
      defaultRatio: 1
    },
    {
      id: 'rsi',
      title: 'RSI',
      panelType: 'indicator',
      defaultRatio: 1
    }
  ],
  panels: [
    {
      instanceId: 'ohlc-1',
      definitionId: 'ohlc',
      visible: true,
      order: 1,
      ratio: 3
    },
    {
      instanceId: 'volume-1',
      definitionId: 'volume',
      visible: true,
      order: 2,
      ratio: 1
    },
    {
      instanceId: 'rsi-1',
      definitionId: 'rsi',
      visible: true,
      order: 3,
      ratio: 1
    }
  ]
};
