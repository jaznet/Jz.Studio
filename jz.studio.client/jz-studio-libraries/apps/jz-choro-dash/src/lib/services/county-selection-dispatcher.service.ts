import {
  EventEmitter,
  Inject,
  Injectable,
  NgZone
} from '@angular/core';

import { CountySelection } from '../models/county-selection.model';
import { CountySelectionDispatcher } from '../models/county-selection-dispatcher.model';
import { CountyFeature } from '../models/county-feature.model';
import { CountySelectionFactory } from '../models/factories/county-selection-factory.model';
import { COUNTY_SELECTION_FACTORY } from './county-selection-factory.token';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionDispatcherService
  implements CountySelectionDispatcher {

  constructor(
    @Inject(COUNTY_SELECTION_FACTORY)
    private countySelectionFactory: CountySelectionFactory,
    private ngZone: NgZone
  ) { }

  dispatch(
    output: EventEmitter<CountySelection>,
    countyFeature: CountyFeature,
    stateId?: string | null
  ): void {
    const selection = this.countySelectionFactory.create(countyFeature, stateId);

    this.ngZone.run(() => output.emit(selection));
}
}
