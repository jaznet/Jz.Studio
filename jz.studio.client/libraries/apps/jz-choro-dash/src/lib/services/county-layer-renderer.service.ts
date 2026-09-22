import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService {

  constructor(
    private countyLayerFactory: CountyLayerFactoryService
  ) {}

  render(options: CountyLayerRenderOptions): void {
    const {
      countyLayer,
      countyFeaturesCollection,
      pathClass,
      gesture,
      onCountySelected,
      includeTitle = false
    } = options;

    const countyPaths = this.countyLayerFactory
      .create({
        countyLayer,
        countyFeaturesCollection,
        pathClass
      })
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
