import {
  EventEmitter,
  Injectable,
  NgZone
} from '@angular/core';

import { CountySelection } from '../models/county-selection.model';
import { CountySelectionFactoryService } from './county-selection-factory.service';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionDispatcherService {

  constructor(
    private countySelectionFactory: CountySelectionFactoryService,
    private ngZone: NgZone
  ) { }

  dispatch(
    output: EventEmitter<CountySelection>,
    countyFeature: any,
    stateId?: string | null
  ): void {
    const selection = this.countySelectionFactory.create(countyFeature, stateId);

    this.ngZone.run(() => output.emit(selection));
}
}
