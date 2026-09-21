import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionHighlighterService {

  apply(
    countyLayer: any,
    pathSelector: string,
    selectedCountyId: string | null
  ): void {
    const normalizedCountyId = selectedCountyId
      ? String(selectedCountyId).padStart(5, '0')
      : null;

    countyLayer
      .selectAll(pathSelector)
      .classed('is-selected', (county: any) =>
        normalizedCountyId !== null &&
        String(county.id ?? '').padStart(5, '0') === normalizedCountyId
      );
  }
}
