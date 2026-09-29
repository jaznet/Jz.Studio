import { CountyPaintingStrategy } from '../../paint-factory/interfaces/county-painting-strategy';

export interface CountyPaintingStrategyFactory {
  createStrategy(): CountyPaintingStrategy;
}
