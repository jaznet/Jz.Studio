import { Injectable } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartLayoutRequest } from '../../interfaces/chart-layout-request.interface';
import { PanelAttributes, PanelViewModel } from '../../interfaces/panel-interfaces';
import { Scaffold } from '../../interfaces/scaffold.interface';
import { Rect } from '../../interfaces/common-interfaces';
import { WorkspacePanelInstance } from '../../../../../_framework/layout/panel-workspace/interfaces/workspace-panel-instance.interface';
import { PanelWorkspaceService } from '../../../../../_framework/layout/panel-workspace/services/panel-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class PanelLayoutService {

  constructor(
    private panelWorkspaceService: PanelWorkspaceService
  ) { }

  buildScaffold(request: ChartLayoutRequest): Scaffold {
    const panelsContainer = this.panelWorkspaceService.buildPanelsContainer(request);
    const panels = this.buildPanels(request, panelsContainer);

    return {
      titleHeight: request.titleHeight,
      width: request.width,
      height: request.height,
      xAxisTop: request.xAxisTopHeight,
      xAxisBottom: request.xAxisBottomHeight,
      yAxisLeft: request.axisLeftWidth,
      yAxisRight: request.axisRightWidth,
      margins: request.margins,
      panelsContainer,
      panels
    };
  }

  private buildPanels(
    request: ChartLayoutRequest,
    panelsContainer: Rect
  ): Partial<Record<ChartType, PanelAttributes>> {

    const availableHeight = panelsContainer.height;

    console.log('availableHeight', availableHeight);

    const panelDefs = request.panels ?? [];

    const totalRatio = panelDefs.reduce((sum, p) => sum + (p.ratio ?? 0), 0) || 1;

    let currentY = 0;

    const result: Partial<Record<ChartType, PanelAttributes>> = {};

    panelDefs.forEach((def, index) => {

      const panelHeight = availableHeight * (def.ratio / totalRatio);

      const panelRect: Rect = {
        x: panelsContainer.x,
        y: panelsContainer.y + currentY,
        width: panelsContainer.width,
        height: panelHeight
      };

      result[def.chartType] = {
        id: def.id,
        chartType: def.chartType,
        panelRect,
        // you’ll fill these later or already have helpers:
        contentRect: undefined as any,
        axisLeftRect: undefined as any,
        axisRightRect: undefined as any,
        xAxisTopRect: undefined as any,
        xAxisBottomRect: undefined as any,
        titleRect: undefined as any
      };

      currentY += panelHeight;
    });

    // ✅ NOW you can debug
    const totalPanelHeight = Object.values(result).reduce((sum, p) => {
      return sum + (p?.panelRect.height ?? 0);
    }, 0);

    console.log('totalPanelHeight', totalPanelHeight);
    console.log('difference', availableHeight - totalPanelHeight);

    return result;
  }

  buildPanelViewModels(
    request: ChartLayoutRequest
  ): PanelViewModel[] {
    const panelsContainer = this.panelWorkspaceService.buildPanelsContainer(request);

    const panels = this.buildPanels(request, panelsContainer);

    const result: PanelViewModel[] = [];

    Object.entries(panels).forEach(([chartType, panel]) => {
      if (!panel) return;

      const viewModel: PanelViewModel = {
        id: panel.id,
        chartType: chartType as ChartType,
        order: panel.index,
        visible: true,
        bounds: panel.panelRect,
        innerWidth: panel.innerWidth,
        innerHeight: panel.innerHeight,
        rects: {
          panelRect: panel.panelRect,
          titleRect: panel.titleRect,
          axisLeftRect: panel.axisLeftRect,
          axisRightRect: panel.axisRightRect,
          axisTopRect: panel.axisTopRect,
          axisBottomRect: panel.axisBottomRect,
          contentRect: panel.contentRect
        }
      };

      result.push(viewModel);
    });

    return result.sort((a, b) => a.order - b.order);
  }
}
