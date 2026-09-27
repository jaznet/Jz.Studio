import { Inject, Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';
import { select } from 'd3-selection';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerRenderer } from '../models/county-layer-renderer.model';
import { GeoShapeSet } from '../models/geo-shape-set.model';
import { StateLayerSet } from '../models/state-layer-set.model';
import { COUNTY_LAYER_RENDERER } from './county-layer-renderer.token';

export interface StateLayerRenderOptions {
  host: HTMLElement;
  width: number;
  height: number;
  shapeSet: GeoShapeSet;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

@Injectable({
  providedIn: 'root'
})
export class StateLayerRendererService {

  constructor(
    @Inject(COUNTY_LAYER_RENDERER)
    private countyLayerRenderer: CountyLayerRenderer
  ) { }

  render(options: StateLayerRenderOptions): StateLayerSet {
    const layers = this.createLayers(
      options.host,
      options.width,
      options.height
    );

    this.countyLayerRenderer.render({
      countyLayer: layers.countyLayer,
      countyFeaturesCollection: options.shapeSet.features,
      pathClass: 'state-county-path',
      gesture: 'primary-pointer',
      onCountySelected: options.onCountySelected
    });

    this.renderOutline(
      layers.stateLayer,
      options.shapeSet.outline ?? options.shapeSet.features
    );

    return layers;
  }

  private createLayers(
    host: HTMLElement,
    width: number,
    height: number
  ): StateLayerSet {
    select(host).selectAll('*').remove();

    const svg = select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100%');

    const outerGroup = svg
      .append('g')
      .attr('class', 'state-outer-group');

    const titleLayer = svg
      .append('g')
      .attr('class', 'state-title-layer');

    const stateLayer = outerGroup
      .append('g')
      .attr('class', 'state-group');

    return {
      svg,
      outerGroup,
      titleLayer,
      stateLayer,
      countyLayer: stateLayer
        .append('g')
        .attr('class', 'counties-group')
    };
  }

  private renderOutline(
    stateLayer: StateLayerSet['stateLayer'],
    shape: GeoShapeSet['features']
  ): void {
    stateLayer
      .append('path')
      .datum(shape)
      .attr('class', 'choro-state-mesh')
      .attr('d', geoPath())
      .attr('pointer-events', 'none');
  }
}
