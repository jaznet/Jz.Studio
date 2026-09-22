import { Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';

import { CountyFeature } from '../models/county-feature.model';
import {
  CountyLayerFactory,
  CountyLayerFactoryOptions,
  CountyPathSelection
} from '../models/county-layer-factory.model';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerFactoryService implements CountyLayerFactory {

  private readonly path = geoPath();

  create(options: CountyLayerFactoryOptions): CountyPathSelection {
    const {
      countyLayer,
      countyFeaturesCollection,
      pathClass
    } = options;

    return countyLayer
      .selectAll<SVGPathElement, CountyFeature>('path')
      .data(
        countyFeaturesCollection.features,
        (county: CountyFeature) => county.id!
      )
      .join('path')
      .attr('d', this.path as any)
      .attr('fips', (county: CountyFeature) => county.id!)
      .attr(
        'name',
        (county: CountyFeature) => county.properties?.name ?? null
      )
      .attr('class', pathClass)
      .attr('vector-effect', 'non-scaling-stroke');
  }
}
