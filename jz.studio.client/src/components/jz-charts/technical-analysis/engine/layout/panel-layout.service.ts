import { Injectable } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartLayoutRequest } from '../../interfaces/chart-layout-request.interface';
import { PanelAttributes, PanelViewModel, Rect } from '../../interfaces/panel-interfaces';
import { Scaffold } from '../../interfaces/scaffold.interface';

@Injectable({
  providedIn: 'root'
})
export class PanelLayoutService {

  buildScaffold(request: ChartLayoutRequest): Scaffold {
    const panelsContainer = this.buildPanelsContainer(request);
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

  private buildPanelsContainer(request: ChartLayoutRequest): Rect {
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
      request.xAxisTopHeight -
      request.xAxisBottomHeight;

    return {
      x,
      y,
      width: Math.max(0, width),
      height: Math.max(0, height)
    };
  }

  private buildPanels(
    request: ChartLayoutRequest,
    panelsContainer: Rect
  ): Partial<Record<ChartType, PanelAttributes>> {
    const result: Partial<Record<ChartType, PanelAttributes>> = {};

    const panels = request.panels ?? [];

    const normalizedPanels = this.normalizeRatios(
      panels.map(panel => ({
        chartType: panel.chartType,
        ratio: panel.ratio
      }))
    );

    const totalGapHeight = Math.max(0, panels.length - 1) * request.panelGap;
    const usableHeight = Math.max(0, panelsContainer.height - totalGapHeight);

    let currentY = 0;

    normalizedPanels.forEach((panel, index) => {
      const ratio = panel.ratio;
      const chartType = panel.chartType;
      const isLast = index === normalizedPanels.length - 1;

      let panelHeight = Math.round(usableHeight * ratio);

      if (isLast) {
        panelHeight = (panelsContainer.y + panelsContainer.height) - currentY;
      }

      const panelRect: Rect = {
        x: 0,
        y: currentY,
        width: panelsContainer.width,
        height: Math.max(0, panelHeight)
      };

      const titleRect: Rect = {
        x: panelRect.x,
        y: panelRect.y,
        width: panelRect.width,
        height: 0
      };

      const axisLeftRect: Rect = {
        x: panelRect.x,
        y: panelRect.y,
        width: request.axisLeftWidth,
        height: panelRect.height
      };

      const axisRightRect: Rect = {
        x: panelRect.x + panelRect.width - request.axisRightWidth,
        y: panelRect.y,
        width: request.axisRightWidth,
        height: panelRect.height
      };

      const xAxisTopRect: Rect = {
        x: request.axisLeftWidth,
        y: currentY,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: 0
      };

      const xAxisBottomRect: Rect = {
        x: panelRect.x + request.axisLeftWidth,
        y: panelRect.y + panelRect.height,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: 0
      };

      const contentRect: Rect = {
        x: panelRect.x + request.axisLeftWidth,
        y: panelRect.y,
        width: Math.max(0, panelRect.width - request.axisLeftWidth - request.axisRightWidth),
        height: panelRect.height
      };

      result[chartType] = {
        id: String(chartType),
        index,
        panelRect,
        titleRect,
        axisLeftRect,
        axisRightRect,
        axisTopRect: xAxisTopRect,
        axisBottomRect: xAxisBottomRect,
        contentRect,
        innerWidth: contentRect.width,
        innerHeight: contentRect.height
      };

      currentY += panelRect.height + request.panelGap;
    });

    return result;
  }

  buildPanelViewModels(
    request: ChartLayoutRequest
  ): PanelViewModel[] {

    const panelsContainer = this.buildPanelsContainer(request);
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

  private normalizeRatios(
    panels: { chartType: ChartType; ratio: number }[]
  ): { chartType: ChartType; ratio: number }[] {

    let total = 0;

    // sanitize + sum
    const safePanels = panels.map(p => {
      const safeRatio = p.ratio > 0 ? p.ratio : 0;
      total += safeRatio;

      return {
        ...p,
        ratio: safeRatio
      };
    });

    // fallback to equal distribution
    if (total <= 0) {
      const equalRatio = 1 / panels.length;

      return panels.map(p => ({
        ...p,
        ratio: equalRatio
      }));
    }

    // normalize
    return safePanels.map(p => ({
      ...p,
      ratio: p.ratio / total
    }));
  }
}
