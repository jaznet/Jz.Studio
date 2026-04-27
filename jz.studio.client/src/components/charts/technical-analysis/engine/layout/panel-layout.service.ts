// panel-layout.service.ts

import { Injectable } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartLayoutRequest } from '../../interfaces/chart-layout-request.interface';
import { PanelAttributes, PanelViewModel } from '../../interfaces/panel-interfaces';
import { DivRect } from '../../interfaces/common-interfaces';
import { ChartScaffold } from '../../interfaces/chart-scafffold.interface';
@Injectable({
  providedIn: 'root'
})
export class PanelLayoutService {

  buildScaffold(request: ChartLayoutRequest): ChartScaffold {
    const panelHostsContainer = this.buildPanelHostsContainer(request);
    const chartMap = this.buildPanels(request, panelHostsContainer);

    return {
      titleWidth: request.titleWidth,
      titleHeight: request.titleHeight,
      width: request.width,
      height: request.height,
      xAxisTop: request.xAxisTopHeight,
      xAxisBottom: request.xAxisBottomHeight,
      yAxisLeft: request.axisLeftWidth,
      yAxisRight: request.axisRightWidth,
      margins: request.margins,
      panelHostsContainer,
      chartMap
    };
  }

  private buildPanelHostsContainer(request: ChartLayoutRequest): DivRect {
    const x = 0;
    const y = request.titleHeight + request.xAxisTopHeight;

    const width = request.width;

    const height = Math.max(
      0,
      request.height
      - request.titleHeight
      - request.xAxisTopHeight
      - request.xAxisBottomHeight
    );

    return { x, y, width, height };
  }

  private buildPanels(
    request: ChartLayoutRequest,
    panelHostsContainer: DivRect
  ): Partial<Record<ChartType, PanelAttributes>> {
    const availableHeight = panelHostsContainer.height;
    const panelDefs = request.panels ?? [];
    const totalRatio = panelDefs.reduce((sum, p) => sum + (p.ratio ?? 0), 0) || 1;

    let currentY = 0;

    const result: Partial<Record<ChartType, PanelAttributes>> = {};

    panelDefs.forEach((def, index) => {
      const panelHeight = Math.max(0, availableHeight * (def.ratio / totalRatio));

      const panelRect: DivRect = {
        x: 0,
        y: currentY,
        width: panelHostsContainer.width,
        height: panelHeight
      };

      const titleHeight = 0;
      const axisTopHeight = def.showXAxisTop === true ? request.xAxisTopHeight : 0;
      const axisBottomHeight = def.showXAxisBottom === true ? request.xAxisBottomHeight : 0;
      const axisLeftWidth = def.showAxisLeft === true ? request.axisLeftWidth : 0;
      const axisRightWidth = def.showAxisRight === true ? request.axisRightWidth : 0;

      const innerWidth = Math.max(0, panelRect.width - axisLeftWidth - axisRightWidth);
      const innerHeight = Math.max(0, panelRect.height - titleHeight - axisTopHeight - axisBottomHeight);

      const titleRect: DivRect = {
        x: panelRect.x,
        y: panelRect.y,
        width: panelRect.width,
        height: titleHeight
      };

      const axisTopRect: DivRect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + titleHeight,
        width: innerWidth,
        height: axisTopHeight
      };

      const axisBottomRect: DivRect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + panelRect.height - axisBottomHeight,
        width: innerWidth,
        height: axisBottomHeight
      };

      const axisLeftRect: DivRect = {
        x: panelRect.x,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: Math.max(0, axisLeftWidth),
        height: Math.max(0, innerHeight)
      };

      const axisRightRect: DivRect = {
        x: panelRect.x + panelRect.width - axisRightWidth,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: Math.max(0, axisRightWidth),
        height: Math.max(0, innerHeight)
      };

      const contentRect: DivRect = {
        x: panelRect.x + axisLeftWidth,
        y: panelRect.y + titleHeight + axisTopHeight,
        width: Math.max(0, innerWidth),
        height: Math.max(0, innerHeight)
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

    return result;
  }

  buildPanelViewModels(
    request: ChartLayoutRequest
  ): PanelViewModel[] {
    const panelsContainer = this.buildPanelHostsContainer(request);

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
