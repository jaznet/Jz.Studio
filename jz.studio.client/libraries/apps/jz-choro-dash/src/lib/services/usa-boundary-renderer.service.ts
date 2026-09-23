import { Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';

import { SvgGroupSelection } from '../models/svg-layer-selection.model';
import {
  StateBoundaryGeometry,
  StateFeatureCollection
} from '../models/state-feature.model';

@Injectable({
  providedIn: 'root'
})
export class UsaBoundaryRendererService {

  private readonly path = geoPath();

  render(
    stateLayer: SvgGroupSelection,
    nationLayer: SvgGroupSelection,
    stateFeaturesCollection: StateFeatureCollection,
    stateMesh: StateBoundaryGeometry,
    nationMesh: StateBoundaryGeometry
  ): void {
    stateLayer
      .selectAll('path.choro-state-feature')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('path')
      .attr('class', 'choro-state-feature')
      .attr('d', this.path)
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('pointer-events', 'none');

    stateLayer
      .append('path')
      .datum(stateMesh)
      .attr('id', 'statemesh')
      .attr('class', 'choro-state-mesh')
      .attr('d', this.path)
      .attr('pointer-events', 'none');

    nationLayer
      .append('path')
      .datum(nationMesh)
      .attr('class', 'choro-nation-mesh')
      .attr('d', this.path)
      .attr('pointer-events', 'none');
  }
}
