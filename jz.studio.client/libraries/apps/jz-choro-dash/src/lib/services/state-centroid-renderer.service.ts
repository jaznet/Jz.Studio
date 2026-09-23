import { Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';

import { SvgGroupSelection } from '../models/svg-layer-selection.model';
import {
  StateFeature,
  StateFeatureCollection
} from '../models/state-feature.model';

@Injectable({
  providedIn: 'root'
})
export class StateCentroidRendererService {

  private readonly path = geoPath();

  render(
    usaLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection
  ): void {
    const centroidLayer = usaLayer
      .append('g')
      .attr('id', 'gStateCentroids')
      .attr('class', 'state-centroid-layer');

    centroidLayer
      .selectAll('rect.state-geo-bbox')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('rect')
      .attr('class', 'state-geo-bbox')
      .attr('data-state-id', (stateFeature: StateFeature) =>
        String(stateFeature.id ?? '')
      )
      .attr('x', (stateFeature: StateFeature) =>
        this.path.bounds(stateFeature)[0][0]
      )
      .attr('y', (stateFeature: StateFeature) =>
        this.path.bounds(stateFeature)[0][1]
      )
      .attr('width', (stateFeature: StateFeature) =>
        this.path.bounds(stateFeature)[1][0] -
        this.path.bounds(stateFeature)[0][0]
      )
      .attr('height', (stateFeature: StateFeature) =>
        this.path.bounds(stateFeature)[1][1] -
        this.path.bounds(stateFeature)[0][1]
      )
      .attr('fill', 'none')
      .attr('stroke', 'skyblue')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');

    centroidLayer
      .selectAll('circle.state-centroid')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('circle')
      .attr('class', 'state-centroid')
      .attr('cx', (stateFeature: StateFeature) =>
        this.path.centroid(stateFeature)[0]
      )
      .attr('cy', (stateFeature: StateFeature) =>
        this.path.centroid(stateFeature)[1]
      )
      .attr('r', 3)
      .attr('fill', 'skyblue')
      .attr('stroke', '#101820')
      .attr('stroke-width', 1);
  }
}
