// county-painting-strategy.token.ts

import { InjectionToken } from '@angular/core';

export interface CountyPaintingStrategy {
  popups: string;
  getColor(countyData: any): string;
  getData(
    popover_loading: any,
    popover_httperror: any,
    callback: (data: any) => void
  ): void;
}

export const COUNTY_PAINTING_STRATEGY =
  new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');
