import { EventEmitter } from '@angular/core';

import { CountyFeature } from './county-feature.model';
import { CountySelection } from './county-selection.model';

export interface CountySelectionDispatcher {
  dispatch(
    output: EventEmitter<CountySelection>,
    countyFeature: CountyFeature,
    stateId?: string | null
  ): void;
}
