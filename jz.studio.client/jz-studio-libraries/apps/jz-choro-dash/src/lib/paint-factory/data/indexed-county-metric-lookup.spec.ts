import { COUNTY_VALUES_FIXTURE } from '../../../testing/fixtures/county-values.fixture';
import { IndexedCountyMetricLookup } from './indexed-county-metric-lookup';

describe('IndexedCountyMetricLookup', () => {
  const lookup = new IndexedCountyMetricLookup(COUNTY_VALUES_FIXTURE);

  it('finds a metric value by county identifier', () => {
    expect(lookup.getValue('06059')).toBe(50);
  });

  it('preserves zero as a valid metric value', () => {
    expect(lookup.getValue('06071')).toBe(0);
  });

  it('returns undefined when the dataset has no county', () => {
    expect(lookup.getValue('99999')).toBeUndefined();
  });
});
