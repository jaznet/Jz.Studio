import {
  UsaRenderOptions,
  UsaRenderRequest
} from '../usa-renderer.model';

export interface UsaRenderRequestFactory {
  create(request: UsaRenderRequest): UsaRenderOptions | null;
}
