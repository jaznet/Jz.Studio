import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';
import { CountyTitleRenderStepService } from './county-title-render-step.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService
  implements CountyLayerRenderPipeline {

  constructor(
    private countyLayerFactory: CountyLayerFactoryService,
    private countySelectionGestureBinder: CountySelectionGestureBinderService,
    private countyTitleRenderStep: CountyTitleRenderStepService
  ) {}

  render(options: CountyLayerRenderOptions): void {
    const {
      countyLayer,
      countyFeaturesCollection,
      pathClass,
      gesture,
      onCountySelected
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

    this.countyTitleRenderStep.execute({
      countyPaths,
      options
    });
  }
}
