import { Injectable } from '@angular/core';
import { ChartType } from '../../enums/chart-type';
import { ChartLayoutRequest } from '../../interfaces/chart-layout-request.interface';
import { PanelAttributes, Rect } from '../../interfaces/panel-attributes.interface';
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

    const panels = [
      { chartType: ChartType.OHLC, ratio: 0.4 },
      { chartType: ChartType.VOLUME, ratio: 0.2 },
      { chartType: ChartType.RSI, ratio: 0.2 }
    ];

    const normalizedPanels = this.normalizeRatios(panels);
    const totalGapHeight = Math.max(0, panels.length - 1) * request.panelGap;
    const usableHeight = Math.max(0, panelsContainer.height - totalGapHeight);

    let currentY = panelsContainer.y;

    normalizedPanels.forEach((panel, index) => {
      const ratio = panel.ratio;
      const chartType = panel.chartType;
      const isLast = index === normalizedPanels.length - 1;

      let panelHeight = Math.round(usableHeight * ratio);

      if (isLast) {
        panelHeight = (panelsContainer.y + panelsContainer.height) - currentY;
      }

      const panelRect: Rect = {
        x: panelsContainer.x,
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
        x: panelRect.x + request.axisLeftWidth,
        y: panelRect.y,
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
        xAxisTopRect,
        xAxisBottomRect,
        contentRect,
        innerWidth: contentRect.width,
        innerHeight: contentRect.height
      };

      currentY += panelRect.height + request.panelGap;
    });

    return result;
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
