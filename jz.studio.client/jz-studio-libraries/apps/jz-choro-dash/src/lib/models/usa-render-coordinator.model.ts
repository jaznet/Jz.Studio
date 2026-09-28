import {
  UsaRenderHandle,
  UsaRenderRequest
} from './usa-renderer.model';

export interface UsaRenderCoordinator {
  render(request: UsaRenderRequest): UsaRenderHandle | null;
}
