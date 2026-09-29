import { COUNTY_VALUES_FIXTURE } from '../../../testing/fixtures/county-values.fixture';
import { IndexedCountyMetricLookup } from '../data/indexed-county-metric-lookup';
import { ThresholdCountyColorScale } from '../color-scales/threshold-county-color-scale';
import { MetricCountyColorResolver } from './metric-county-color-resolver';

describe('MetricCountyColorResolver', () => {
  const lookup = new IndexedCountyMetricLookup(COUNTY_VALUES_FIXTURE);
  const scale = new ThresholdCountyColorScale([
    { maximum: 25, color: 'low' },
    { maximum: 75, color: 'middle' },
    { maximum: 100, color: 'high' }
  ]);
  const resolver = new MetricCountyColorResolver(lookup, scale, 'no-data');

  it('resolves a county metric through the configured color scale', () => {
    expect(resolver.getColor('06059')).toBe('middle');
  });

  it('preserves a zero value instead of treating it as missing', () => {
    expect(resolver.getColor('06071')).toBe('low');
  });

  it('uses the configured fallback when a county has no metric', () => {
    expect(resolver.getColor('99999')).toBe('no-data');
  });
});
