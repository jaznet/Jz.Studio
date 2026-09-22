import { Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService {

  constructor(
    private countyLayerFactory: CountyLayerFactoryService,
    private countySelectionGestureBinder: CountySelectionGestureBinderService
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

    const countyPaths = this.countyLayerFactory.create({
      countyLayer,
      countyFeaturesCollection,
      pathClass
    });

    this.countySelectionGestureBinder.bind(
      countyPaths,
      gesture,
      onCountySelected
    );

    if (includeTitle) {
      countyPaths
        .selectAll('title')
        .data((county: CountyFeature) => [county])
        .join('title')
        .text((county: CountyFeature) => county.properties?.name ?? '');
    }
  }
}
