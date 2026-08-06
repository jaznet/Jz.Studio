import { InjectionToken } from '@angular/core';
import { CountyPaintingStrategy } from '../paint-factory/interfaces/county-painting-strategy';

export const COUNTY_PAINTING_STRATEGY =
  new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');
