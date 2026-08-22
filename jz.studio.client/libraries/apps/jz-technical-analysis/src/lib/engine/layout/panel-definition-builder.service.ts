import { Injectable } from '@angular/core';

import { PanelDefinition } from '../../interfaces/panel-interfaces';
import { PanelPreference } from '../../interfaces/panel-preference.interface';

@Injectable({ providedIn: 'root' })
export class PanelDefinitionBuilderService {
  build(preferences: readonly PanelPreference[]): PanelDefinition[] {
    const visiblePreferences = preferences
      .filter(preference => preference.visible)
      .sort((a, b) => a.order - b.order);

    return visiblePreferences.map((preference, index) => ({
      id: preference.id,
      chartType: preference.chartType,
      ratio: preference.ratio,
      showAxisLeft: preference.showAxisLeft ?? true,
      showAxisRight: preference.showAxisRight ?? false,
      showXAxisTop: preference.showXAxisTop ?? false,
      showXAxisBottom:
        preference.showXAxisBottom ?? index === visiblePreferences.length - 1
    }));
  }
}
