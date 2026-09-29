import { Injectable } from '@angular/core';

import { CountyFeature } from '../../models/county-feature.model';
import { CountySelection } from '../../models/county-selection.model';
import { CountySelectionFactory } from '../../models/factories/county-selection-factory.model';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionFactoryService
  implements CountySelectionFactory {

  create(
    countyFeature: CountyFeature,
    stateId?: string | null
  ): CountySelection {
    const countyId = String(countyFeature.id ?? '')
      .padStart(5, '0');

    const resolvedStateId = String(
      stateId ?? countyId.substring(0, 2)
    ).padStart(2, '0');

    return {
      countyId,
      stateId: resolvedStateId,
      countyFeature
    };
  }
}
