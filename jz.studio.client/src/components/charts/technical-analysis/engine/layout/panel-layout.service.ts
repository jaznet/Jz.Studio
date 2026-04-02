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

      const titleHeight = def.showTitle ? request.titleHeight : 0;
      const axisTopHeight = def.showXAxisTop === true ? request.xAxisTopHeight : 0;
      const axisBottomHeight = def.showXAxisBottom === true ? request.xAxisBottomHeight : 0;
      const axisLeftWidth = def.showAxisLeft === true ? request.axisLeftWidth : 0;
      const axisRightWidth = def.showAxisRight === true ? request.axisRightWidth : 0;

      const innerWidth = Math.max(0, panelRect.width - axisLeftWidth - axisRightWidth);
      const innerHeight = Math.max(0, panelRect.height - titleHeight - axisTopHeight - axisBottomHeight);

      const titleRect: Rect = {
        x: panelRect.x,
        y: panelRect.y,
        width: panelRect.width,
        height: titleHeight
      };

      const axisTopRect: Rect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + titleHeight,
        width: innerWidth,
        height: axisTopHeight
      };

      const axisBottomRect: Rect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + panelRect.height - axisBottomHeight,
        width: innerWidth,
        height: axisBottomHeight
      };

      const axisLeftRect: Rect = {
        x: panelRect.x,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: axisLeftWidth,
        height: innerHeight
      };

      const axisRightRect: Rect = {
        x: panelRect.x + panelRect.width - axisRightWidth,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: axisRightWidth,
        height: innerHeight
      };

      const contentRect: Rect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: innerWidth,
        height: innerHeight
      };

      result[def.chartType] = {
        id: def.id,
        index,
        panelRect,
        titleRect,
        axisLeftRect,
        axisRightRect,
        axisTopRect,
        axisBottomRect,
        contentRect,
        innerWidth,
        innerHeight
      };

      currentY += panelHeight;
    });

    const totalPanelHeight = Object.values(result).reduce((sum, p) => {
      return sum + (p?.panelRect.height ?? 0);
    }, 0);

    console.log('availableHeight', availableHeight);
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
