import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyPathCreationStepService } from './county-path-creation-step.service';
import { CountySelectionRenderStepService } from './county-selection-render-step.service';
import { CountyTitleRenderStepService } from './county-title-render-step.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService
  implements CountyLayerRenderPipeline {

  constructor(
    private countyPathCreationStep: CountyPathCreationStepService,
    private countySelectionRenderStep: CountySelectionRenderStepService,
    private countyTitleRenderStep: CountyTitleRenderStepService
  ) {}

  render(options: CountyLayerRenderOptions): void {
    const context = this.countyPathCreationStep.execute({ options });

    this.countySelectionRenderStep.execute(context);
    this.countyTitleRenderStep.execute(context);
  }
}
