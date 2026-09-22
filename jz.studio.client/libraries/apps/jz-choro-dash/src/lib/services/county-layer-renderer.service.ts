import { Injectable } from '@angular/core';
import { geoPath } from 'd3-geo';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService {

  private readonly path = geoPath();

  render(options: CountyLayerRenderOptions): void {
    const {
      countyLayer,
      countyFeaturesCollection,
      pathClass,
      gesture,
      onCountySelected,
      includeTitle = false
    } = options;

    const countyPaths = countyLayer
      .selectAll('path')
      .data(countyFeaturesCollection.features, (county: CountyFeature) => county.id)
      .join('path')
      .attr('d', this.path as any)
      .attr('fips', (county: CountyFeature) => county.id)
      .attr('name', (county: CountyFeature) => county.properties?.name)
      .attr('class', pathClass)
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', null)
      .on('pointerup', null);

    if (gesture === 'primary-pointer') {
      countyPaths.on(
        'pointerup',
        (event: PointerEvent, countyFeature: CountyFeature) => {
          if (!event.isPrimary || event.button !== 0) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          onCountySelected(countyFeature);
        }
      );
    } else {
      countyPaths.on(
        'click',
        (_event: MouseEvent, countyFeature: CountyFeature) =>
          onCountySelected(countyFeature)
      );
    }

    if (includeTitle) {
      countyPaths
        .selectAll('title')
        .data((county: CountyFeature) => [county])
        .join('title')
        .text((county: CountyFeature) => county.properties?.name ?? '');
    }
  }
}
