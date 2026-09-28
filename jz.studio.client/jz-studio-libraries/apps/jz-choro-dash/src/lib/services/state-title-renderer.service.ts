import { Inject, Injectable } from '@angular/core';

import { StateLookupCatalog } from '../interfaces/state-lookup';
import { SvgGroupSelection } from '../models/svg-layer-selection.model';
import { STATE_LOOKUP } from './state-lookup.token';

@Injectable({
  providedIn: 'root'
})
export class StateTitleRendererService {

  constructor(
    @Inject(STATE_LOOKUP)
    private stateLookup: StateLookupCatalog
  ) { }

  render(
    titleLayer: SvgGroupSelection,
    stateId: string | null,
    width: number
  ): void {
    const selectedStateFips = String(stateId ?? '34').padStart(2, '0');
    const stateName =
      this.stateLookup.statesDictionary[selectedStateFips]?.stateName ?? '';

    titleLayer
      .selectAll('text.state-title')
      .data([stateName])
      .join('text')
      .attr('class', 'state-title')
      .attr('x', width - 24)
      .attr('y', 36)
      .attr('text-anchor', 'end')
      .text(stateName);
  }
}
