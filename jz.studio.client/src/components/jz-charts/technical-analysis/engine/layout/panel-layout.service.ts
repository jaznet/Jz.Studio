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
      yAxisLeft: request.yAxisLeftWidth,
      yAxisRight: request.yAxisRightWidth,
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

    const panelOrder = request.panelOrder ?? [];
    if (panelOrder.length === 0) {
      return result;
    }

    const normalizedRatios = this.normalizeRatios(panelOrder, request.panelRatios);
    const totalGapHeight = Math.max(0, panelOrder.length - 1) * request.panelGap;
    const usableHeight = Math.max(0, panelsContainer.height - totalGapHeight);

    let currentY = panelsContainer.y;

    panelOrder.forEach((chartType, index) => {
      const ratio = normalizedRatios[chartType] ?? 0;
      const isLast = index === panelOrder.length - 1;

      let panelHeight = Math.round(usableHeight * ratio);

      if (isLast) {
        panelHeight = (panelsContainer.y + panelsContainer.height) - currentY;
      }

      const bounds: Rect = {
        x: panelsContainer.x,
        y: currentY,
        width: panelsContainer.width,
        height: Math.max(0, panelHeight)
      };

      const axisLeft: Rect = {
        x: bounds.x,
        y: bounds.y,
        width: request.yAxisLeftWidth,
        height: bounds.height
      };

      const axisRight: Rect = {
        x: bounds.x + bounds.width - request.yAxisRightWidth,
        y: bounds.y,
        width: request.yAxisRightWidth,
        height: bounds.height
      };

      const content: Rect = {
        x: bounds.x + request.yAxisLeftWidth,
        y: bounds.y,
        width: Math.max(0, bounds.width - request.yAxisLeftWidth - request.yAxisRightWidth),
        height: bounds.height
      };

      result[chartType] = {
        chartType,
        bounds,
        content,
        axisLeft,
        axisRight,
        order: index,
        ratio
      };

      currentY += bounds.height + request.panelGap;
    });

    return result;
  }

  private normalizeRatios(
    panelOrder: ChartType[],
    panelRatios: Partial<Record<ChartType, number>>
  ): Partial<Record<ChartType, number>> {
    const result: Partial<Record<ChartType, number>> = {};

    let total = 0;

    panelOrder.forEach(chartType => {
      const value = panelRatios[chartType] ?? 0;
      const safeValue = value > 0 ? value : 0;
      result[chartType] = safeValue;
      total += safeValue;
    });

    if (total <= 0) {
      const equalRatio = 1 / panelOrder.length;
      panelOrder.forEach(chartType => {
        result[chartType] = equalRatio;
      });
      return result;
    }

    panelOrder.forEach(chartType => {
      result[chartType] = (result[chartType] ?? 0) / total;
    });

    return result;
  }
}
