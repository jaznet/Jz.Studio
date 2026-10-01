import { InjectionToken } from '@angular/core';

export interface ChoroDashCountyApiConfig {
  readonly medianAgeUrl: string;
  readonly year: number;
  readonly requestTimeoutMs: number;
}

export const CHORO_DASH_COUNTY_API_CONFIG =
  new InjectionToken<ChoroDashCountyApiConfig>('ChoroDashCountyApiConfig');

export const CHORO_DASH_COUNTY_API_DEFAULTS: ChoroDashCountyApiConfig = {
  medianAgeUrl: '/api/choro-data/county-metrics/median-age',
  // Verified Population.YEAR key; its calendar-year meaning is not yet confirmed.
  year: 1,
  // Allow time for a cold database connection before offering Retry.
  requestTimeoutMs: 60_000
};
