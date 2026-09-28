import { Inject, Injectable } from '@angular/core';

import {
  UsaRenderHandle,
  UsaRenderer,
  UsaRenderRequest
} from '../models/usa-renderer.model';
import { UsaRenderRequestFactoryService } from './usa-render-request-factory.service';
import { USA_RENDERER } from './usa-renderer.token';

@Injectable({
  providedIn: 'root'
})
export class UsaRenderCoordinatorService {

  constructor(
    @Inject(USA_RENDERER)
    private usaRenderer: UsaRenderer,
    private requestFactory: UsaRenderRequestFactoryService
  ) { }

  render(request: UsaRenderRequest): UsaRenderHandle | null {
    const options = this.requestFactory.create(request);

    if (!options) {
      return null;
    }

    return this.usaRenderer.render(options);
  }
}
