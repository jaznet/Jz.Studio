import { CountyMetricLookup } from '../../models/county-metric-lookup.model';
import { CountyMetricValue } from '../../models/county-metric-value.model';

export class IndexedCountyMetricLookup implements CountyMetricLookup {
  private readonly valuesByCountyId: ReadonlyMap<string, number>;

  constructor(values: readonly CountyMetricValue[]) {
    this.valuesByCountyId = new Map(
      values.map(item => [item.countyId, item.value])
    );
  }

  getValue(countyId: string): number | undefined {
    return this.valuesByCountyId.get(countyId);
  }
}
