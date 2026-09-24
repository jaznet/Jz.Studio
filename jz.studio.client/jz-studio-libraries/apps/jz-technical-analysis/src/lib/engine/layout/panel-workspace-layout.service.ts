import { Injectable } from '@angular/core';

import { ChartLayoutRequest } from '../../interfaces/chart-layout-request.interface';
import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { PanelPreference } from '../../interfaces/panel-preference.interface';
import { PanelDefinitionBuilderService } from './panel-definition-builder.service';
import { PanelLayoutService } from './panel-layout.service';

@Injectable({ providedIn: 'root' })
export class PanelWorkspaceLayoutService {
  constructor(
    private panelDefinitionBuilder: PanelDefinitionBuilderService,
    private panelLayout: PanelLayoutService
  ) {}

  applyPreferences(
    scaffold: ChartScaffold,
    preferences: readonly PanelPreference[]
  ): void {
    const request: ChartLayoutRequest = {
      width: scaffold.width,
      height: scaffold.height,
      margins: scaffold.margins,
      axisLeftWidth: scaffold.margins.left,
      axisRightWidth: scaffold.margins.right,
      xAxisTopHeight: scaffold.xAxisTop,
      xAxisBottomHeight: scaffold.xAxisBottom,
      panelGap: 0,
      panels: this.panelDefinitionBuilder.build(preferences)
    };

    const resolved = this.panelLayout.buildScaffold(request);
    scaffold.panelHostsContainer = resolved.panelHostsContainer;
    scaffold.chartMap = resolved.chartMap;
  }
}
