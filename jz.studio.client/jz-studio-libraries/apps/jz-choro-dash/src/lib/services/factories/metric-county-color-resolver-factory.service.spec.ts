import { COUNTY_VALUES_FIXTURE } from '../../../testing/fixtures/county-values.fixture';
import { MetricCountyColorResolverFactoryService } from './metric-county-color-resolver-factory.service';

describe('MetricCountyColorResolverFactoryService', () => {
  const factory = new MetricCountyColorResolverFactoryService();

  it('assembles a resolver from dataset and scale configuration', () => {
    const resolver = factory.create({
      values: COUNTY_VALUES_FIXTURE,
      stops: [
        { maximum: 25, color: 'low' },
        { maximum: 75, color: 'middle' },
        { maximum: 100, color: 'high' }
      ],
      missingValueColor: 'no-data'
    });

    expect(resolver.getColor('06059')).toBe('middle');
    expect(resolver.getColor('99999')).toBe('no-data');
  });
});
