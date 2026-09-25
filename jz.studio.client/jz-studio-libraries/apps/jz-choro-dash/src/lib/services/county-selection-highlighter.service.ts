import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerSelection } from '../models/county-layer-factory.model';
import { CountySelectionHighlighter } from '../models/county-selection-highlighter.model';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionHighlighterService
  implements CountySelectionHighlighter {

  apply(
    countyLayer: CountyLayerSelection,
    pathSelector: string,
    selectedCountyId: string | null
  ): void {
    const normalizedCountyId = selectedCountyId
      ? String(selectedCountyId).padStart(5, '0')
      : null;

    countyLayer
      .selectAll<SVGPathElement, CountyFeature>(pathSelector)
      .classed('is-selected', (county: CountyFeature) =>
        normalizedCountyId !== null &&
        String(county.id ?? '').padStart(5, '0') === normalizedCountyId
      );
  }
}
