import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipelineService } from './county-layer-render-pipeline.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService {

  constructor(
    private countyLayerRenderPipeline: CountyLayerRenderPipelineService
  ) {}

  render(options: CountyLayerRenderOptions): void {
    this.countyLayerRenderPipeline.render(options);
  }
}
