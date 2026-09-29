export interface CountyMetricLookup {
  getValue(countyId: string): number | undefined;
}
