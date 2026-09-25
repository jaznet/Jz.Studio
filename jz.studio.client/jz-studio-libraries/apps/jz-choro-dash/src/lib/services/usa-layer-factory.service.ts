import { Injectable } from '@angular/core';
import { select } from 'd3-selection';

import { UsaLayerSet } from '../models/usa-layer-set.model';

@Injectable({
  providedIn: 'root'
})
export class UsaLayerFactoryService {

  create(
    host: HTMLElement,
    width: number,
    height: number
  ): UsaLayerSet {
    select(host).selectAll('*').remove();

    const svg = select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100%');

    const usaLayer = svg.append('g').attr('id', 'usa');

    return {
      svg,
      usaLayer,
      countyLayer: usaLayer.append('g').attr('id', 'county-layer'),
      stateLayer: usaLayer.append('g').attr('id', 'state-layer'),
      nationLayer: usaLayer.append('g').attr('id', 'nation-layer'),
      stateTextLayer: usaLayer.append('g').attr('id', 'state-name-layer')
    };
  }
}
