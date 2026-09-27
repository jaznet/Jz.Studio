import { Injectable } from '@angular/core';

import { SvgGroupSelection } from '../models/svg-layer-selection.model';
import { StateLookupService } from './state-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class StateTitleRendererService {

  constructor(
    private stateLookup: StateLookupService
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
