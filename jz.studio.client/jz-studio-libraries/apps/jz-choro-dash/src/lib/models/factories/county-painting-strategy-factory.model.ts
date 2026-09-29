import { CountyPaintingMode } from '../county-painting-mode.model';
import { CountyPaintingStrategy } from '../../paint-factory/interfaces/county-painting-strategy';

export interface CountyPaintingStrategyFactory {
  createStrategy(mode: CountyPaintingMode): CountyPaintingStrategy;
}
