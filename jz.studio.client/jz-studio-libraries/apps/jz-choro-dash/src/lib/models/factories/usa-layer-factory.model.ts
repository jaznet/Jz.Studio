import { UsaLayerSet } from '../usa-layer-set.model';

export interface UsaLayerFactory {
  create(
    host: HTMLElement,
    width: number,
    height: number
  ): UsaLayerSet;
}
