import { CountyColorResolver } from '../../models/county-color-resolver.model';
import { CountyColorScale } from '../../models/county-color-scale.model';
import { CountyMetricLookup } from '../../models/county-metric-lookup.model';

export class MetricCountyColorResolver implements CountyColorResolver {
  constructor(
    private readonly metricLookup: CountyMetricLookup,
    private readonly colorScale: CountyColorScale,
    private readonly missingValueColor: string
  ) {}

  getColor(countyId: string): string {
    const value = this.metricLookup.getValue(countyId);

    return value === undefined
      ? this.missingValueColor
      : this.colorScale.getColor(value);
  }
}
