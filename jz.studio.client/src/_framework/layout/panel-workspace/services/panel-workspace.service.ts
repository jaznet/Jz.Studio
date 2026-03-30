import { Injectable } from '@angular/core';
import { PanelWorkspaceState } from '../interfaces/panel-workspace-state.interface';
import { WorkspacePanelInstance } from '../interfaces/workspace-panel-instance.interface';
import { Rect } from '../../../../components/charts/technical-analysis/interfaces/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class PanelWorkspaceService {

  getActivePanels(state: PanelWorkspaceState): WorkspacePanelInstance[] {
    return state.panels
      .filter(panel => panel.visible)
      .sort((a, b) => a.order - b.order);
  }

  buildPanelsContainer(request: {
    width: number;
    height: number;
    margins: { top: number; right: number; bottom: number; left: number };
    titleHeight: number;
    xAxisTopHeight: number;
    xAxisBottomHeight: number;
  }): Rect {
    const x = request.margins.left;
    const y = request.margins.top + request.titleHeight + request.xAxisTopHeight;

    const width =
      request.width -
      request.margins.left -
      request.margins.right;

    const height =
      request.height -
      request.margins.top -
      request.margins.bottom -
      request.titleHeight -
      request.xAxisTopHeight;

    return {
      x,
      y,
      width: Math.max(0, width),
      height: Math.max(0, height)
    };
  }

  buildStackedPanelRects(
    panels: WorkspacePanelInstance[],
    panelsContainer: Rect,
    panelGap: number
  ): Array<{
    panel: WorkspacePanelInstance;
    rect: Rect;
  }> {
    const activePanels = panels
      .filter(panel => panel.visible)
      .sort((a, b) => a.order - b.order);

    const normalizedPanels = this.normalizeRatios(activePanels);

    const totalGapHeight = Math.max(0, normalizedPanels.length - 1) * panelGap;
    const usableHeight = Math.max(0, panelsContainer.height - totalGapHeight);

    let currentY = 0;

    return normalizedPanels.map((panel, index) => {
      const isLast = index === normalizedPanels.length - 1;

      let panelHeight = Math.round(usableHeight * panel.ratio);

      if (isLast) {
        panelHeight = panelsContainer.height - currentY;
      }

      const rect: Rect = {
        x: 0,
        y: currentY,
        width: panelsContainer.width,
        height: Math.max(0, panelHeight)
      };

      currentY += rect.height + panelGap;

      return {
        panel,
        rect
      };
    });
  }

  private normalizeRatios(
    panels: WorkspacePanelInstance[]
  ): WorkspacePanelInstance[] {
    let total = 0;

    const safePanels = panels.map(panel => {
      const safeRatio = panel.ratio > 0 ? panel.ratio : 0;
      total += safeRatio;

      return {
        ...panel,
        ratio: safeRatio
      };
    });

    if (total <= 0) {
      const equalRatio = panels.length > 0 ? 1 / panels.length : 0;

      return panels.map(panel => ({
        ...panel,
        ratio: equalRatio
      }));
    }

    return safePanels.map(panel => ({
      ...panel,
      ratio: panel.ratio / total
    }));
  }
}
