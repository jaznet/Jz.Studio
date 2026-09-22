import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    private countySelectionGestureBinder: CountySelectionGestureBinderService
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    if (!context.countyPaths) {
      throw new Error('County paths must be created before binding selection.');
    }

    const {
      gesture,
      onCountySelected
    } = context.options;

    this.countySelectionGestureBinder.bind(
      context.countyPaths,
      gesture,
      onCountySelected
    );

    return context;
  }
}
