import { Injectable } from '@angular/core';
import {
  geoAlbersUsa,
  geoCentroid,
  geoPath
} from 'd3-geo';

import { SvgGroupSelection } from '../models/svg-layer-selection.model';
import {
  StateFeature,
  StateFeatureCollection
} from '../models/state-feature.model';
import { StateLookupService } from './state-lookup.service';

@Injectable({
  providedIn: 'root'
})
export class StateLabelRendererService {

  private readonly path = geoPath();
  private readonly projection = geoAlbersUsa();

  constructor(private stateLookup: StateLookupService) { }

  render(
    stateTextLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection
  ): void {
    stateTextLayer
      .selectAll<SVGTextElement, StateFeature>('text.state-label')
      .data(
        stateFeaturesCollection.features,
        (stateFeature: StateFeature) => this.getStateId(stateFeature)
      )
      .join('text')
      .attr('class', 'choro-usa-state-label')
      .attr('id', (stateFeature: StateFeature) =>
        `state-label-${this.getStateId(stateFeature)}`
      )
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('x', (stateFeature: StateFeature) =>
        this.path.centroid(stateFeature)[0]
      )
      .attr('y', (stateFeature: StateFeature) =>
        this.path.centroid(stateFeature)[1]
      )
      .attr('transform', (stateFeature: StateFeature) => {
        const [x, y] = this.path.centroid(stateFeature);
        const stateId = this.getStateId(stateFeature);
        const placement = this.stateLookup.statesDictionary[stateId];

        const rotate =
          (placement?.albersRotate ??
            this.getLatitudeTangentAngle(stateFeature)) * -1;

        return `rotate(${rotate}, ${x}, ${y})`;
      })
      .text((stateFeature: StateFeature) =>
        this.stateLookup.statesDictionary[this.getStateId(stateFeature)]
          ?.stateName ?? ''
      );
  }

  private getStateId(stateFeature: StateFeature): string {
    return String(stateFeature.id ?? '');
  }

  private getLatitudeTangentAngle(stateFeature: StateFeature): number {
    const [lon, lat] = geoCentroid(stateFeature);
    const delta = 0.5;
    const p1 = this.projection([lon - delta, lat]);
    const p2 = this.projection([lon + delta, lat]);

    if (!p1 || !p2) {
      return 0;
    }

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];

    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
}
