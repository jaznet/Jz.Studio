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
    const panelsContainer = this.panelWorkspaceService.buildPanelsContainer({
      width: request.width,
      height: request.height,
      margins: request.margins,
      titleHeight: request.titleHeight,
      xAxisTopHeight: request.xAxisTopHeight,
      xAxisBottomHeight: request.xAxisBottomHeight
    });

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
    const result: Partial<Record<ChartType, PanelAttributes>> = {};

    const runtimePanels: WorkspacePanelInstance[] = (request.panels ?? []).map((panel, index) => ({
      instanceId: `${String(panel.chartType)}-${index}`,
      definitionId: String(panel.chartType),
      visible: true,
      order: index,
      ratio: panel.ratio
    }));

    const stackedPanels = this.panelWorkspaceService.buildStackedPanelRects(
      runtimePanels,
      panelsContainer,
      request.panelGap
    );

    stackedPanels.forEach(({ panel, rect }, index) => {
      const chartType = panel.definitionId as ChartType;
      const panelRect = rect;

      const titleRect: Rect = {
        x: panelRect.x,
        y: panelRect.y,
        width: panelRect.width,
        height: 0
      };

      const axisLeftRect: Rect = {
        x: 0,
        y: panelRect.y,
        width: request.axisLeftWidth,
        height: panelRect.height
      };

      const axisRightRect: Rect = {
        x: panelRect.width - request.axisRightWidth,
        y: panelRect.y,
        width: request.axisRightWidth,
        height: panelRect.height
      };

      const axisTopRect: Rect = {
        x: request.axisLeftWidth,
        y: panelRect.y,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: 0
      };

      const axisBottomRect: Rect = {
        x: request.axisLeftWidth,
        y: panelRect.y + panelRect.height,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: 0
      };

      const contentRect: Rect = {
        x: request.axisLeftWidth,
        y: panelRect.y,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: panelRect.height
      };

      result[chartType] = {
        id: panel.definitionId,
        index,
        panelRect,
        titleRect,
        axisLeftRect,
        axisRightRect,
        axisTopRect,
        axisBottomRect,
        contentRect,
        innerWidth: contentRect.width,
        innerHeight: contentRect.height
      };
    });

    return result;
  }

  buildPanelViewModels(
    request: ChartLayoutRequest
  ): PanelViewModel[] {
    const panelsContainer = this.panelWorkspaceService.buildPanelsContainer({
      width: request.width,
      height: request.height,
      margins: request.margins,
      titleHeight: request.titleHeight,
      xAxisTopHeight: request.xAxisTopHeight,
      xAxisBottomHeight: request.xAxisBottomHeight
    });

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
