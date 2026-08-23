import { Injectable, type ComponentRef } from '@angular/core';
import type { ScaleBand } from 'd3-scale';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { PanelPreference } from '../../interfaces/panel-preference.interface';
import { ChartComponentMap } from '../../maps/chart-component-map';
import { StockPriceHistory } from '../../models/stock-price-history.model';
import { PanelHostService } from '../../support/panel-workspace/panel-host.service';

interface ChartPanelRenderRequest {
  containerElement: SVGGElement;
  scaffold: ChartScaffold;
  preferences: readonly PanelPreference[];
  data: readonly StockPriceHistory[];
  dateScaleX: ScaleBand<Date>;
}

@Injectable({ providedIn: 'root' })
export class ChartPanelRendererService {
  constructor(private panelHost: PanelHostService) {}

  render(request: ChartPanelRenderRequest): ComponentRef<unknown>[] {
    const chartMap = request.scaffold.chartMap;
    if (!chartMap) return [];

    const refs: ComponentRef<unknown>[] = [];
    const preferences = request.preferences
      .filter(preference => preference.visible)
      .sort((left, right) => left.order - right.order);

    preferences.forEach(preference => {
      const panel = chartMap[preference.chartType];
      if (!panel) return;

      const host = request.containerElement.querySelector(
        `#panel-host-${panel.id}`
      ) as SVGGElement | null;
      if (!host) return;

      const chartComponent = ChartComponentMap[preference.chartType];
      if (!chartComponent) return;

      const componentRef = this.panelHost.injectChartComponent(
        host,
        preference.chartType,
        chartComponent
      );

      componentRef.setInput('data', request.data);
      componentRef.setInput('dateScaleX', request.dateScaleX);
      componentRef.setInput('panel', panel);
      componentRef.setInput('scaffold', request.scaffold);

      componentRef.instance.markReadyAndDraw({
        dataReady: true,
        inputsInitialized: true,
        caller: 'ChartPanelRendererService.render'
      });

      componentRef.changeDetectorRef.detectChanges();
      refs.push(componentRef as ComponentRef<unknown>);
    });

    return refs;
  }
}
