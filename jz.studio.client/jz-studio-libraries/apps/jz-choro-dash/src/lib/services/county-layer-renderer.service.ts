import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderer } from '../models/county-layer-renderer.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { COUNTY_LAYER_RENDER_PIPELINE } from './county-layer-render-pipeline.token';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRendererService
  implements CountyLayerRenderer {

  constructor(
    @Inject(COUNTY_LAYER_RENDER_PIPELINE)
    private countyLayerRenderPipeline: CountyLayerRenderPipeline
  ) {}

  render(options: CountyLayerRenderOptions): void {
    this.countyLayerRenderPipeline.render(options);
  }
}
