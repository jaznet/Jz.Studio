import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyLayerRenderContextGuardService } from './county-layer-render-context-guard.service';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    private countySelectionGestureBinder: CountySelectionGestureBinderService,
    private contextGuard: CountyLayerRenderContextGuardService
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    const countyPaths = this.contextGuard.requireCountyPaths(
      context,
      'binding selection'
    );

    const {
      gesture,
      onCountySelected
    } = context.options;

    this.countySelectionGestureBinder.bind(
      countyPaths,
      gesture,
      onCountySelected
    );

    return context;
  }
}
