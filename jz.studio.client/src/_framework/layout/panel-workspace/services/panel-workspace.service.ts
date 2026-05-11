import { Injectable } from '@angular/core';
import { PanelWorkspaceState } from '../interfaces/panel-workspace-state.interface';
import { WorkspacePanelInstance } from '../interfaces/workspace-panel-instance.interface';
import { DivRect } from '../../../../_components/charts/technical-analysis/interfaces/common-interfaces';
import { ChartLayoutRequest } from '../../../../_components/charts/technical-analysis/interfaces/chart-layout-request.interface';

@Injectable({
  providedIn: 'root'
})
export class PanelWorkspaceService {

  getActivePanels(state: PanelWorkspaceState): WorkspacePanelInstance[] {
    return state.panels
      .filter(panel => panel.visible)
      .sort((a, b) => a.order - b.order);
  }

  buildPanelsContainer(request: ChartLayoutRequest): DivRect {
     const x = 0;
     const y = request.titleHeight + request.xAxisTopHeight;

     const width = request.width;

     const height =
       request.height
       - request.titleHeight
       - request.xAxisTopHeight
       - request.xAxisBottomHeight;

    return { x, y, width, height };
  }

  buildStackedPanelRects(
    panels: WorkspacePanelInstance[],
    panelsContainer: DivRect,
    panelGap: number
  ): Array<{
    panel: WorkspacePanelInstance;
    rect: DivRect;
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

      const rect: DivRect = {
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
