import { CountyMetricValue } from './county-metric-value.model';

export class CountyMetricValueLookup {
  private readonly values = new Map<string, number>();

  constructor(countyValues: readonly CountyMetricValue[] = []) {
    for (const metric of countyValues) {
      this.values.set(metric.countyId, metric.value);
    }
  }

  get(countyId: string): number | undefined {
    return this.values.get(countyId);
  }
}

