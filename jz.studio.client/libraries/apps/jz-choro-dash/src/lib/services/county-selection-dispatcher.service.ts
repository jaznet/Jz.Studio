import {
  EventEmitter,
  Injectable,
  NgZone
} from '@angular/core';

import { CountySelection } from '../models/county-selection.model';
import { CountySelectionDispatcher } from '../models/county-selection-dispatcher.model';
import { CountyFeature } from '../models/county-feature.model';
import { CountySelectionFactoryService } from './county-selection-factory.service';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionDispatcherService
  implements CountySelectionDispatcher {

  constructor(
    private countySelectionFactory: CountySelectionFactoryService,
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
