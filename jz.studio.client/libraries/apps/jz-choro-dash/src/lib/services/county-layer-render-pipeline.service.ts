import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';
import { CountyTitleRendererService } from './county-title-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService {

  constructor(
    private countyLayerFactory: CountyLayerFactoryService,
    private countySelectionGestureBinder: CountySelectionGestureBinderService,
    private countyTitleRenderer: CountyTitleRendererService
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
      this.countyTitleRenderer.render(countyPaths);
    }
  }
}
