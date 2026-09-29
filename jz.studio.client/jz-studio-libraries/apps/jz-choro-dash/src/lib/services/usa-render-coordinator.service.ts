import { Inject, Injectable } from '@angular/core';

import { UsaRenderRequestFactory } from '../models/factories/usa-render-request-factory.model';
import { UsaRenderCoordinator } from '../models/usa-render-coordinator.model';
import {
  UsaRenderHandle,
  UsaRenderer,
  UsaRenderRequest
} from '../models/usa-renderer.model';
import { USA_RENDER_REQUEST_FACTORY } from './factories/usa-render-request-factory.token';
import { USA_RENDERER } from './usa-renderer.token';

@Injectable({
  providedIn: 'root'
})
export class UsaRenderCoordinatorService implements UsaRenderCoordinator {

  constructor(
    @Inject(USA_RENDERER)
    private usaRenderer: UsaRenderer,
    @Inject(USA_RENDER_REQUEST_FACTORY)
    private requestFactory: UsaRenderRequestFactory
  ) { }

  render(request: UsaRenderRequest): UsaRenderHandle | null {
    const options = this.requestFactory.create(request);

    if (!options) {
      return null;
    }

    return this.usaRenderer.render(options);
  }
}
